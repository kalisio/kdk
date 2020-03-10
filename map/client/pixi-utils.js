import _ from 'lodash'
import * as PIXI from 'pixi.js'

export const toHalf = (function () {
  var floatView = new Float32Array(1)
  var int32View = new Int32Array(floatView.buffer)

  /* This method is faster than the OpenEXR implementation (very often
    * used, eg. in Ogre), with the additional benefit of rounding, inspired
    * by James Tursa?s half-precision code. */
  return function toHalf (val) {
    floatView[0] = val
    var x = int32View[0]

    var bits = (x >> 16) & 0x8000 /* Get the sign */
    var m = (x >> 12) & 0x07ff /* Keep one extra bit for rounding */
    var e = (x >> 23) & 0xff /* Using int is faster here */

    /* If zero, or denormal, or exponent underflows too much for a denormal
      * half, return signed zero. */
    if (e < 103) {
      return bits
    }

    /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
    if (e > 142) {
      bits |= 0x7c00
      /* If exponent was 0xff and one mantissa bit was set, it means NaN,
        * not Inf, so make sure we set one mantissa bit too. */
      bits |= ((e === 255) ? 0 : 1) && (x & 0x007fffff)
      return bits
    }

    /* If exponent underflows but not too much, return a denormal */
    if (e < 113) {
      m |= 0x0800
      /* Extra rounding may overflow and set mantissa to 0 and exponent
        * to 1, which is OK. */
      bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1)
      return bits
    }

    bits |= ((e - 112) << 10) | (m >> 1)
    /* Extra rounding. An overflow will set mantissa to 0 and increment
      * the exponent, which is OK. */
    bits += m & 1
    return bits
  }
}())

export const WEBGL_FUNCTIONS = {
  latLonToWebMercator: `vec2 latLonToWebMercator(vec3 latLonZoom) {
  const float d = 3.14159265359 / 180.0;
  const float maxLat = 85.0511287798;     // max lat using Web Mercator, used by EPSG:3857 CRS
  const float R = 6378137.0;              // earth radius

  // project
  // float lat = max(min(maxLat, latLonZoom[0]), -maxLat);
  float lat = clamp(latLonZoom[0], -maxLat, maxLat);
  float sla = sin(lat * d);
  vec2 point = vec2(R * latLonZoom[1] * d, R * log((1.0 + sla) / (1.0 - sla)) / 2.0);

  // scale
  float scale = 256.0 * pow(2.0, latLonZoom[2]);

  // transform
  const float s = 0.5 / (3.14159265359 * R);
  const vec4 abcd = vec4(s, 0.5, -s, 0.5);

  return scale * ((point * abcd.xz) + abcd.yw);
}`,
  unpack1: `float unpack1(float v, vec2 offsetScale) {
  return offsetScale.x + v * offsetScale.y;
}`,
  unpack2: `vec2 unpack2(vec2 v, vec4 offsetScale) {
  return offsetScale.xy + v * offsetScale.zw;
}`
}

// define half float vertex webgl type
PIXI.TYPES.HALF_FLOAT_VERTEX = 0x140b

export function buildShaderCode (features) {
  let vtxCode = ''
  let frgCode = ''
  // attributes, uniforms and varyings
  vtxCode += '/// attributes, uniforms and varyings\n'
  frgCode += '/// uniforms and varyings\n'
  for (const feat of features) {
    let addVtx = ''
    let addFrg = ''
    for (const v of _.get(feat, 'vertex.attributes', [])) addVtx += `attribute ${v};\n`
    for (const v of _.get(feat, 'vertex.uniforms', [])) addVtx += `uniform ${v};\n`
    for (const v of _.get(feat, 'fragment.uniforms', [])) addFrg += `uniform ${v};\n`
    for (const v of _.get(feat, 'varyings', [])) {
      addVtx += `varying ${v};\n`
      addFrg += `varying ${v};\n`
    }

    if (addVtx) vtxCode += `// ${feat.name} ------\n${addVtx}`
    if (addFrg) frgCode += `// ${feat.name} ------\n${addFrg}`
  }
  // additional functions
  vtxCode += '\n/// additional functions\n'
  frgCode += '\n/// additional functions\n'
  for (const feat of features) {
    for (const v of _.get(feat, 'vertex.functions', [])) vtxCode += `// ${feat.name} ------\n${v}\n`
    for (const v of _.get(feat, 'fragment.functions', [])) frgCode += `// ${feat.name} ------\n${v}\n`
  }
  // main
  vtxCode += '\n/// vertex shader code\nvoid main()\n{\n'
  frgCode += '\n/// fragment shader code\nvoid main()\n{\n'
  for (const feat of features) {
    const vc = _.get(feat, 'vertex.code')
    const fc = _.get(feat, 'fragment.code')
    if (vc) vtxCode += `// ${feat.name} ------\n${vc}\n`
    if (fc) frgCode += `// ${feat.name} ------\n${fc}\n`
  }
  vtxCode += '}'
  frgCode += '}'

  return [vtxCode, frgCode]
}

function buildColorMapShaderCode (thresholds, colors, interpolate) {
  // thresholds values are expected in ascending order
  //
  // when not interpolating colors:
  //   expects N threshold values and N-1 colors
  //   builds the following colormap:
  //
  //    [ color0 [ color1 [ ..... [ colorn-1 ]
  //    |        |        |       |          |
  // thresh0  thresh1  thresh2 threshn-1  threshn
  //
  //   below thresh0, color will be color0
  //   above threshn, color will be colorn-1
  //
  // when interpolate is true, colors are interpolated between thresholds
  //   expects N threshold values and N colors
  //   builds the following colormap:
  //
  //  color0 .. color1 .. color2 ..... colorn-1 .. colorn
  //    |         |         |            |           |
  // thresh0   thresh1   thresh2      threshn-1   threshn
  //
  //   below thresh0, color will be color0
  //   above threshn, color will be colorn

  // make sure thresholds array is sorted in ascending order
  for (let i = 1; i < thresholds.length; ++i) {
    if (thresholds[i - 1] > thresholds[i]) {
      throw new Error('Threshold array is not correctly sorted, color map shader code will be buggy!')
    }
  }

  let code = 'vec4 ColorMap(float value) {\n'
  for (let i = 0; i < colors.length; ++i) {
    code += `  const vec4 color${i} = vec4(${colors[i].join(',')});\n`
  }
  code += '\n'

  if (!interpolate) {
    // skip threshold0 test since any value < thresh1 will get color0
    for (let i = 1; i < thresholds.length - 1; ++i) {
      const threshold = thresholds[i]
      code += `  if (value < float(${threshold})) { return color${i - 1}; }\n`
    }
    // skip thresholdn test since any value >= threshn-1 will get colorn-1
    code += `  return color${colors.length - 1};\n`
  } else {
    // below thresh0 => color0
    code += `  if (value < float(${thresholds[0]})) { return color0; }\n`
    for (let i = 1; i < thresholds.length; ++i) {
      const t0 = thresholds[i - 1]
      const t1 = thresholds[i]
      const dt = t1 - t0
      code += `  if (value <= float(${t1})) { float t = (value - float(${t0})) / float(${dt}); return mix(color${i - 1}, color${i}, t); }\n`
    }
    // above threshn => colorn
    code += `  return color${colors.length - 1};\n`
  }
  code += '}'
  return code
}

export function buildColorMapShaderCodeFromDomain (domain, colors, invertScale) {
  // expects N values in domain an N colors
  //  color0 .. color1 .. color2 ..... colorn-1 .. colorn
  //    |         |         |            |           |
  //  dom0      dom1      dom2         domn-1      domn
  // colors will be interpolated between domain values
  // domain array is assumed to be sorted (ascending or descending)

  let thresholds = []
  let mapping = colors.slice()

  if (domain.length === colors.length) {
    thresholds = domain.slice()
  } else if (domain.length < colors.length) {
    // insert additional thresholds so that num colors = num thresholds
    const step = (domain[domain.length - 1] - domain[0]) / (colors.length - 1)
    for (let i = 0; i < colors.length; ++i) {
      thresholds.push(domain[0] + (i * step))
    }
  }

  // make sure thresholds array is sorted in ascending order
  if (thresholds[0] > thresholds[thresholds.length - 1]) {
    thresholds = thresholds.reverse()
    invertScale = !invertScale
  }

  if (invertScale) {
    mapping = mapping.reverse()
  }

  return buildColorMapShaderCode(thresholds, mapping, true)
}

export function buildColorMapShaderCodeFromClasses (breaks, colors, invertScale) {
  // expects N breaks and N-1 colors
  //   [  color0 [ color1 [ .... [ colorn-1 ]
  //   |         |        |      |          |
  // break0    break1   break2 breakn-1   breakn
  // breaks array is assumed to be sorted (ascending or descending)

  let thresholds = breaks.slice()
  let mapping = colors.slice()

  // make sure thresholds array is sorted in ascending order
  if (thresholds[0] > thresholds[thresholds.length - 1]) {
    thresholds = thresholds.reverse()
    invertScale = !invertScale
  }

  if (invertScale) {
    mapping = mapping.reverse()
  }

  return buildColorMapShaderCode(thresholds, mapping, false)
}

export class ColorMapHook {
  constructor (colormap, attribute) {
    this.colormap = colormap
    this.attribute = attribute
  }

  initialize (grid) {
    this.grid = grid
    const dims = grid.getDimensions()
    const latCount = dims[0]
    const lonCount = dims[1]
    this.color = new Uint8Array(4 * latCount * lonCount)
  }

  iterate (vidx, ilat, ilon) {
    const val = this.grid.getValue(ilat, ilon)
    const mapped = this.colormap(val)
    const rgb = mapped.rgb()
    this.color[vidx * 4] = rgb[0]
    this.color[vidx * 4 + 1] = rgb[1]
    this.color[vidx * 4 + 2] = rgb[2]
    this.color[vidx * 4 + 3] = 255
  }

  finalize (geometry) {
    geometry.addAttribute(this.attribute, this.color, 4, true, PIXI.TYPES.UNSIGNED_BYTE)
  }
}

export class RawValueHook {
  constructor (attribute) {
    this.attribute = attribute
  }

  initialize (grid) {
    this.grid = grid
    const dims = grid.getDimensions()
    const latCount = dims[0]
    const lonCount = dims[1]
    this.value = new Float32Array(latCount * lonCount)
  }

  iterate (vidx, ilat, ilon) {
    const val = this.grid.getValue(ilat, ilon)
    this.value[vidx] = val
  }

  finalize (geometry) {
    geometry.addAttribute(this.attribute, this.value, 1, false, PIXI.TYPES.FLOAT)
  }
}

export function buildPixiMeshFromGrid (grid, hooks) {
  const dims = grid.getDimensions()
  const latCount = dims[0]
  const lonCount = dims[1]

  // const position = new Float32Array(2 * latCount * lonCount)
  const position = new Uint16Array(2 * latCount * lonCount)
  for (const hook of hooks) { hook.initialize(grid) }

  const bbox = grid.getBBox()
  const minLat = bbox[0]
  const minLon = bbox[1]
  const maxLat = bbox[2]
  const maxLon = bbox[3]

  const deltaLat = maxLat - minLat
  const deltaLon = maxLon - minLon

  // fill attributes
  let vidx = 0
  for (let ilon = 0; ilon < lonCount; ++ilon) {
    const lon = grid.getLon(ilon)
    for (let ilat = 0; ilat < latCount; ++ilat) {
      const lat = grid.getLat(ilat)

      position[vidx * 2] = toHalf((lat - minLat) / deltaLat)
      position[vidx * 2 + 1] = toHalf((lon - minLon) / deltaLon)
      /*
            position[vidx * 2] = lat
            position[vidx * 2 + 1] = lon
            */

      for (const hook of hooks) { hook.iterate(vidx, ilat, ilon) }

      ++vidx
    }
  }

  // fill index
  let iidx = 0
  // choose 16 or 32 bit index
  const maxIndex = (lonCount - 1) * latCount + (latCount - 1)
  const index = maxIndex > 65534
    ? new Uint32Array((lonCount - 1) * (latCount * 2 + 1) - 1)
    : new Uint16Array((lonCount - 1) * (latCount * 2 + 1) - 1)
  const restart = maxIndex > 65534 ? 4294967295 : 65535
  for (let i = 0; i < lonCount - 1; ++i) {
    for (let j = 0; j < latCount; ++j) {
      index[iidx++] = j + i * latCount
      index[iidx++] = j + (i + 1) * latCount
    }
    if (i !== lonCount - 2) { index[iidx++] = restart }
  }

  const geometry = new PIXI.Geometry()
    .addAttribute('in_layerPosition', position, 2, false, PIXI.TYPES.HALF_FLOAT_VERTEX)
  // .addAttribute('position', position, 2)
    .addIndex(index)

  for (const hook of hooks) { hook.finalize(geometry) }

  return geometry
}
