import * as faceapi from 'face-api.js'

const MODEL_URL = "/models"
let modelsLoaded = false

export const loadFaceModels = async () => {
  if (modelsLoaded) return

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ])

  modelsLoaded = true
}

export const getFaceDescriptor = async (video) => {
  if (!video) return null

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  return detection
}

export const compareFaces = (storedDescriptor, currentDescriptor) => {
  const labeled = new faceapi.LabeledFaceDescriptors(
    'user',
    [Float32Array.from(storedDescriptor)]
  )

  const matcher = new faceapi.FaceMatcher(labeled, 0.6)
  return matcher.findBestMatch(currentDescriptor)
}
