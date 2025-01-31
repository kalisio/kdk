// We need to dynamically import cesium to dynamically get constructors
export let Cesium

async function loadCesium() {
  Cesium = await import(`cesium`)
}

loadCesium()

export function createWallGeometry (positions, minimumHeights = [], maximumHeights = []) {
  if (!positions || positions.length < 2) return

  minimumHeights = minimumHeights || Array(positions.length).fill(0)
  minimumHeights = Array.isArray(minimumHeights) ? minimumHeights : Array(positions.length).fill(minimumHeights)
  if (!maximumHeights) {
    maximumHeights = []
    for (let i = 0, j = positions.length; i < j; ++i) {
      const cartographic = Cesium.Cartographic.fromCartesian(positions[i])
      maximumHeights.push(cartographic.height)
    }
  }
  maximumHeights = Array.isArray(maximumHeights) ? maximumHeights : Array(positions.length).fill(maximumHeights)

  const setHeight = (cartesian, height) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    cartographic.height = height
    return Cesium.Cartographic.toCartesian(cartographic)
  }

  // Generate positions and st
  const indices = []
  const distances = [0]
  const times = (positions.length - 1) * 2
  let lineLength = 0
  let minHeight = -1
  for (let i = 0; i < times; i++) {
    if (i % 2) {
      indices.push(i + 2, i - 1, i + 1)
    } else {
      indices.push(i + 1, i, i + 3)
    }

    if (positions[i + 1]) {
      const distance = Cesium.Cartesian3.distance(positions[i], positions[i + 1])
      distances.push(distance)
      lineLength += distance
    }
  }

  let percent = 0
  const st = []
  const wallPositions = []
  for (let i = 0; i < positions.length; i++) {
    // St
    percent += distances[i] / lineLength
    if (i === positions.length - 1) percent = 1
    st.push(percent, 0, percent, 1)

    // Positions
    const position = positions[i]
    const bottomPoint = setHeight(position, minimumHeights[i])
    const topPoint = setHeight(position, maximumHeights[i])
    wallPositions.push(
      bottomPoint.x,
      bottomPoint.y,
      bottomPoint.z,
      topPoint.x,
      topPoint.y,
      topPoint.z
    )

    // Min height
    const currentHeight = Math.abs(maximumHeights[i] - minimumHeights[i])
    if (minHeight === -1 || currentHeight < minHeight) minHeight = currentHeight
  }

  return {
    geometry: new Cesium.Geometry({
      attributes: {
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: wallPositions
        }),
        st: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float64Array(st)
        })
      },
      indices: new Uint16Array(indices),
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(wallPositions)
    }),
    dimensions: {
      minHeight,
      lineLength
    }
  }
}

export function createCorridorGeometry (positions, width, height) {
  if (!positions || positions.length < 2) return

  const setHeight = (cartesian, height) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    cartographic.height = height
    return Cesium.Cartographic.toCartesian(cartographic)
  }

  const computeOffset = (current, previous, next, offset) => {
    let direction

    if (!previous) {
      // If it's the first point, use only the direction to the next
      direction = Cesium.Cartesian3.subtract(next, current, new Cesium.Cartesian3())
    } else if (!next) {
      // If it's the last point, use only the direction from the previous
      direction = Cesium.Cartesian3.subtract(current, previous, new Cesium.Cartesian3())
    } else {
      // Intermediate points: average of the directions before and after
      const forward = Cesium.Cartesian3.subtract(next, current, new Cesium.Cartesian3())
      const backward = Cesium.Cartesian3.subtract(current, previous, new Cesium.Cartesian3())
      direction = Cesium.Cartesian3.add(forward, backward, new Cesium.Cartesian3())
    }

    Cesium.Cartesian3.normalize(direction, direction)

    // Compute the perpendicular vector
    const up = Cesium.Cartesian3.UNIT_Z
    const perpendicular = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3())
    Cesium.Cartesian3.normalize(perpendicular, perpendicular)

    // Apply the offset
    const offsetVector = Cesium.Cartesian3.multiplyByScalar(perpendicular, offset, new Cesium.Cartesian3())
    return Cesium.Cartesian3.add(current, offsetVector, new Cesium.Cartesian3())
  }

  const indices = []
  const distances = [0]
  let lineLength = 0

  for (let i = 0; i < positions.length - 1; i++) {
    const p0 = positions[i]
    const p1 = positions[i + 1]
    const distance = Cesium.Cartesian3.distance(p0, p1)
    distances.push(distance)
    lineLength += distance

    // Add indices
    const baseIndex = i * 2
    indices.push(
      baseIndex, baseIndex + 1, baseIndex + 2,
      baseIndex + 1, baseIndex + 3, baseIndex + 2
    )
  }

  let percent = 0
  const st = []
  const corridorPositions = []
  for (let i = 0; i < positions.length; i++) {
    // Normalize distances for texture coordinates
    percent += distances[i] / lineLength
    if (i === positions.length - 1) percent = 1
    st.push(percent, 0, percent, 1)

    // Compute the offset positions to create the corridor
    const leftOffset = setHeight(computeOffset(positions[i], positions[i - 1], positions[i + 1], -width / 2), height)
    const rightOffset = setHeight(computeOffset(positions[i], positions[i - 1], positions[i + 1], width / 2), height)

    corridorPositions.push(
      leftOffset.x,
      leftOffset.y,
      leftOffset.z,
      rightOffset.x,
      rightOffset.y,
      rightOffset.z
    )
  }

  return {
    geometry: new Cesium.Geometry({
      attributes: {
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: corridorPositions
        }),
        st: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float64Array(st)
        })
      },
      indices: new Uint16Array(indices),
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(corridorPositions)
    }),
    dimensions: {
      lineLength,
      width
    }
  }
}

export function createMaterialWithMovingTexture (options) {
  if (!options.image) return

  options = {
    image: options.image,
    translucent: options.translucent || false,
    speedX: options.speedX || 0,
    speedY: options.speedY || 0,
    repeatX: options.repeatX || 1,
    repeatY: options.repeatY || 1
  }

  let material = null
  try {
    // TODO : temporary throw to avoid to load material from type because it's not working
    material = Cesium.Material.fromType('MovingMaterial')
    material.uniforms.image = options.image
    material.uniforms.repeat = new Cesium.Cartesian2(options.repeatX, options.repeatY)
    material.uniforms.offset = new Cesium.Cartesian2(0.0, 0.0)
    material.translucent = options.translucent
    throw new Error('Load material from type is not working')
  } catch (e) {
    material = new Cesium.Material({
      fabric: {
        type: 'MovingMaterial',
        source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);

            // Décalage des coordonnées de texture
            vec2 st = materialInput.st * repeat + offset;

            // Boucler la texture avec fract()
            st = fract(st);

            // Application de la texture (WebGL 2.0 - texture au lieu de texture2D)
            vec4 color = texture(image, st);

            material.diffuse = color.rgb;
            material.alpha = color.a;
            return material;
        }`,
        uniforms: {
          image: options.image,
          repeat: new Cesium.Cartesian2(options.repeatX, options.repeatY),
          offset: new Cesium.Cartesian2(0.0, 0.0)
        }
      },
      translucent: options.translucent
    })
  }

  return material
}
