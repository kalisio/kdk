import _ from 'lodash'

// We need to dynamically import cesium to dynamically get constructors
export let Cesium

async function loadCesium() {
  Cesium = await import(`cesium`)
}

loadCesium()

function createWallGeometry (positions, minimumHeights = [], maximumHeights = []) {
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
    st.push(1 - percent, 0, 1 - percent, 1)

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

function createCorridorGeometry (positions, width, height) {
  if (!positions || positions.length < 2) return

  const setHeight = (cartesian, height) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    cartographic.height = height
    return Cesium.Cartographic.toCartesian(cartographic)
  }

  const angleBetweenThreePoints = (A, B, C) => {
    const AB = Cesium.Cartesian3.subtract(B, A, new Cesium.Cartesian3())
    const AC = Cesium.Cartesian3.subtract(C, A, new Cesium.Cartesian3())
    const dot = Cesium.Cartesian3.dot(AB, AC)
    const lengthAB = Cesium.Cartesian3.magnitude(AB)
    const lengthAC = Cesium.Cartesian3.magnitude(AC)
    return Math.acos(dot / (lengthAB * lengthAC))
  }

  const computeOffset = (current, previous, next, offset, normal) => {
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
    const up = normal || Cesium.Cartesian3.UNIT_Z
    const perpendicular = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3())
    Cesium.Cartesian3.normalize(perpendicular, perpendicular)

    // Apply the offset
    const offsetVector = Cesium.Cartesian3.multiplyByScalar(perpendicular, offset, new Cesium.Cartesian3())
    return { direction, position: Cesium.Cartesian3.add(current, offsetVector, new Cesium.Cartesian3()) }
  }

  for (let i = 0; i < positions.length; i++) {
    positions[i] = setHeight(positions[i], height)
  }

  // Find local normal
  // Implies that if the corridor extends over very large distances, the normal may be incorrect
  const normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(positions[0])
  const distances = [0]
  let lineLength = 0
  const corridorPositions = []

  let lastLeftPoint = null
  let lastRightPoint = null
  let lastDirection = null
  for (let i = 0; i < positions.length; i++) {
    // Compute the offset positions to create the corridor
    const left = computeOffset(positions[i], positions[i - 1], positions[i + 1], -width / 2, normal)
    const right = computeOffset(positions[i], positions[i - 1], positions[i + 1], width / 2, normal)

    // Check if [left, right] segment intersects with the previous one
    if (i > 0) {
      const turnLeft = Cesium.Cartesian3.cross(left.direction, lastDirection, new Cesium.Cartesian3()).z < 0

      const previousAngle = angleBetweenThreePoints(positions[i - 1], positions[i], turnLeft ? lastLeftPoint : lastRightPoint)
      const currentAngle = angleBetweenThreePoints(positions[i - 1], positions[i], turnLeft ? left.position : right.position)
      if (currentAngle > previousAngle) {
        if (turnLeft) left.position = lastLeftPoint
        else right.position = lastRightPoint
      }

      const distance = Cesium.Cartesian3.distance(positions[i - 1], positions[i])
      distances.push(distance)
      lineLength += distance
    }

    corridorPositions.push(
      left.position.x,
      left.position.y,
      left.position.z,
      right.position.x,
      right.position.y,
      right.position.z
    )

    lastLeftPoint = left.position
    lastRightPoint = right.position
    lastDirection = left.direction
  }

  let percent = 0
  const st = []
  const indices = []
  for (let i = 0; i < positions.length; i++) {
    // Normalize distances for texture coordinates
    percent += distances[i] / lineLength
    if (i === positions.length - 1) percent = 1
    st.push(1 - percent, 0, 1 - percent, 1)

    // Add indices for triangulation
    if (i < positions.length - 1) {
      const baseIndex = i * 2
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2,
        baseIndex + 1, baseIndex + 3, baseIndex + 2
      )
    }
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

function createMaterialWithMovingTexture (options) {
  if (!options.image) return

  let material = null
  try {
    // TODO : temporary throw to avoid to load material from type because it's not working
    material = Cesium.Material.fromType('MovingMaterial')
    material.uniforms.image = options.image
    material.uniforms.repeat = new Cesium.Cartesian2(1.0, 1.0)
    material.uniforms.offset = new Cesium.Cartesian2(0.0, 0.0)
    material.translucent = options.translucent
    throw new Error('Load material from type is not working')
  } catch (e) {
    const shaderSource = `
      czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);

          vec2 st = materialInput.st * repeat + offset;

          // Loop texture with fract
          st = fract(st);

          vec4 color = texture(image, st);
          material.${options.useAsDiffuse ? 'diffuse' : 'emission'} = color.rgb;
          material.alpha = color.a * opacity;
          return material;
      }`

    material = new Cesium.Material({
      fabric: {
        type: 'MovingMaterial',
        source: shaderSource,
        uniforms: {
          image: options.image,
          repeat: new Cesium.Cartesian2(1.0, 1.0),
          offset: new Cesium.Cartesian2(0.0, 0.0),
          opacity: 0.0
        }
      },
      translucent: _.get(options, 'translucent', false)
    })
  }

  return material
}

export function createPrimitiveWithMovingTexture (type, options) {
  if (!options.positions || !_.get(options, 'material.image', false)) return

  const geometryOptions = {
    positions: options.material.reverseAnimation === true ? options.positions.reverse() : options.positions
  }

  let geometry = null
  switch (type) {
    case 'wall':
      geometryOptions.minimumHeights = _.get(options, 'minimumHeights', 0) // can be a single value
      geometryOptions.maximumHeights = _.get(options, 'maximumHeights', null) // can be a single value
      geometry = createWallGeometry(geometryOptions.positions, geometryOptions.minimumHeights, geometryOptions.maximumHeights)
      break
    case 'corridor':
      geometryOptions.width = _.get(options, 'width', 10)
      geometryOptions.height = _.get(options, 'height', 0)
      geometry = createCorridorGeometry(geometryOptions.positions, geometryOptions.width, geometryOptions.height)
      break
    default:
      break
  }

  if (!geometry) return
  const dimensions = geometry.dimensions
  geometry = geometry.geometry

  // Create material
  const material = createMaterialWithMovingTexture(_.get(options, 'material'))
  if (!material) return

  // By default, whole texture is mapped on the whole wall/corridor geometry
  // Here we make it so texture keep it's aspect ratio, map 1 in the non animated
  // direction, compute what goes in the other dimension
  material.uniforms.repeat.x = dimensions.lineLength / (dimensions.minHeight || dimensions.width)
  // Take potential scale into account
  const scale = _.get(options, 'material.scale')
  let animationSpeedScale = 1.0
  if (scale) {
    if (Array.isArray(scale)) {
      material.uniforms.repeat.x *= scale[0]
      material.uniforms.repeat.y *= scale[1]
      animationSpeedScale = scale[0]
    } else {
      material.uniforms.repeat.x *= scale
      material.uniforms.repeat.y *= scale
      animationSpeedScale = scale
    }
  }

  // Create primitive
  return {
    primitive: new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry
      }),
      appearance: new Cesium.MaterialAppearance({
        material,
        translucent: material.translucent
      }),
      asynchronous: false
    }),
    material: {
      material,
      animationSpeed: _.get(options, 'material.animationSpeed') * animationSpeedScale,
      length: dimensions.lineLength
    }
  }
}

export function getPrimitivesForEntity (entity, viewer) {
  const pickObjects = viewer.scene.context._pickObjects
  const primitives = []
  for (const k in pickObjects) {
    const object = pickObjects[k]
    const objectEntity = _.get(object, 'id')
    if (!objectEntity) continue

    if (objectEntity === entity) {
      const primitive = _.get(object, 'primitive')
      if (primitive) primitives.push(primitive)
    }
  }
  return primitives
}
