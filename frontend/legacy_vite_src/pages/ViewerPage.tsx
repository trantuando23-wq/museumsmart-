import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { fetchArtifactByCode } from '../lib/api'
import { Artifact } from '../lib/types'
import { ArrowLeft } from 'lucide-react'

// Hàm tạo texture mặt trống đồng Đông Sơn chi tiết chân thực
function createBronzeDrumTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Nền đồng cổ patin
  ctx.fillStyle = '#9c6628'
  ctx.fillRect(0, 0, 1024, 1024)

  const cx = 512
  const cy = 512

  // Các vành hoa văn đồng tâm
  const rings = [60, 110, 170, 230, 300, 370, 440, 490]
  ctx.strokeStyle = '#d49b4b'
  ctx.lineWidth = 4

  rings.forEach((r) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  })

  // Ngôi sao 14 cánh ở trung tâm (Thần Mặt Trời)
  const numPoints = 14
  ctx.fillStyle = '#f3ca7e'
  ctx.beginPath()
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2
    const radius = i % 2 === 0 ? 80 : 35
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Vành chim Lạc bay ngược chiều kim đồng hồ
  const birdCount = 8
  const birdRadius = 265
  ctx.fillStyle = '#e8b868'
  for (let i = 0; i < birdCount; i++) {
    const angle = (i * 2 * Math.PI) / birdCount
    const bx = cx + Math.cos(angle) * birdRadius
    const by = cy + Math.sin(angle) * birdRadius
    ctx.save()
    ctx.translate(bx, by)
    ctx.rotate(angle + Math.PI / 2)
    // Vẽ hình dáng cách điệu chim Lạc
    ctx.beginPath()
    ctx.moveTo(0, -22)
    ctx.lineTo(16, 12)
    ctx.lineTo(4, 8)
    ctx.lineTo(0, 26)
    ctx.lineTo(-4, 8)
    ctx.lineTo(-16, 12)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Vành hoa văn răng cưa / hình học
  const teethCount = 72
  const teethRadius = 405
  ctx.fillStyle = '#d49b4b'
  for (let i = 0; i < teethCount; i++) {
    const angle = (i * 2 * Math.PI) / teethCount
    const tx = cx + Math.cos(angle) * teethRadius
    const ty = cy + Math.sin(angle) * teethRadius
    ctx.beginPath()
    ctx.arc(tx, ty, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// Hàm tạo texture gốm hoa lam Chu Đậu
function createChuDauPorcelainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Men gốm tro trấu trắng ngà
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 1024, 1024)

  // Vệt men rạn cổ
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * 1024, Math.random() * 1024)
    ctx.lineTo(Math.random() * 1024, Math.random() * 1024)
    ctx.stroke()
  }

  // Họa tiết men lam cobalt
  ctx.strokeStyle = '#1d4ed8'
  ctx.fillStyle = '#1e40af'
  ctx.lineWidth = 6

  // Dải hoa cúc & sen dây
  for (let y = 150; y < 900; y += 220) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= 1024; x += 80) {
      ctx.quadraticCurveTo(x + 40, y - 30, x + 80, y)
    }
    ctx.stroke()

    // Hoa cúc cách điệu
    for (let x = 60; x < 1000; x += 160) {
      ctx.beginPath()
      ctx.arc(x, y - 10, 16, 0, Math.PI * 2)
      ctx.fill()
      for (let p = 0; p < 8; p++) {
        const pa = (p * Math.PI) / 4
        ctx.beginPath()
        ctx.arc(x + Math.cos(pa) * 26, y - 10 + Math.sin(pa) * 26, 7, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  return new THREE.CanvasTexture(canvas)
}

export const ViewerPage: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)

  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    fetchArtifactByCode(code)
      .then((data) => {
        setArtifact(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [code])

  useEffect(() => {
    if (!mountRef.current || loading) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Camera với phong cách Studio Bảo tàng Ánh sáng Tự nhiên
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf1f5f9)
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.035)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 2.2, 5.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Ánh sáng Studio trưng bày cao cấp
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2)
    keyLight.position.set(4, 9, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.0)
    fillLight.position.set(-4, 4, -3)
    scene.add(fillLight)

    // Bệ đá cẩm thạch trắng viền vàng hoàng gia
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.45, 48)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
    })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.y = -1.1
    pedestal.receiveShadow = true
    scene.add(pedestal)

    // Đai vàng kim bệ trưng bày
    const rimGeo = new THREE.TorusGeometry(1.61, 0.035, 16, 64)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    })
    const goldRim = new THREE.Mesh(rimGeo, rimMat)
    goldRim.rotation.x = Math.PI / 2
    goldRim.position.y = -0.88
    scene.add(goldRim)

    // NHÓM ĐỐI TƯỢNG 3D HIỆN VẬT
    const artifactGroup = new THREE.Group()
    const modelType = artifact?.model_type || 'generic'

    if (modelType === 'bronze_drum') {
      // 1. TRỐNG ĐỒNG ĐÔNG SƠN CHUẨN XÁC
      const drumTexture = createBronzeDrumTexture()
      const bronzeBodyMat = new THREE.MeshStandardMaterial({
        color: 0x9c6628,
        metalness: 0.8,
        roughness: 0.35,
      })
      const drumTopMat = new THREE.MeshStandardMaterial({
        map: drumTexture,
        metalness: 0.75,
        roughness: 0.35,
      })

      // Mặt trống (Tympanum với hoa văn sao 14 cánh & chim Lạc)
      const topGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.08, 48)
      const drumTop = new THREE.Mesh(topGeo, [bronzeBodyMat, drumTopMat, bronzeBodyMat])
      drumTop.position.y = 0.65
      drumTop.castShadow = true
      artifactGroup.add(drumTop)

      // Tang trống phình (Outward swelling shoulder)
      const shoulderGeo = new THREE.CylinderGeometry(1.22, 1.35, 0.45, 48)
      const shoulder = new THREE.Mesh(shoulderGeo, bronzeBodyMat)
      shoulder.position.y = 0.4
      shoulder.castShadow = true
      artifactGroup.add(shoulder)

      // Thân eo trống hình trụ thắt (Cylindrical waist)
      const waistGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.55, 48)
      const waist = new THREE.Mesh(waistGeo, bronzeBodyMat)
      waist.position.y = -0.05
      waist.castShadow = true
      artifactGroup.add(waist)

      // Chân choè hình nón cụt (Flared foot base)
      const footGeo = new THREE.CylinderGeometry(0.95, 1.3, 0.45, 48)
      const foot = new THREE.Mesh(footGeo, bronzeBodyMat)
      foot.position.y = -0.52
      foot.castShadow = true
      artifactGroup.add(foot)

      // 4 Quai trống kép bện thừng (Braid handles)
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2
        const handleGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32, Math.PI)
        const handle = new THREE.Mesh(handleGeo, bronzeBodyMat)
        handle.position.set(Math.cos(angle) * 1.05, 0.22, Math.sin(angle) * 1.05)
        handle.rotation.z = Math.PI / 2
        handle.rotation.y = angle
        artifactGroup.add(handle)
      }
    } else if (modelType === 'golden_seal') {
      // 2. ẤN VÀNG SẮC MỆNH CHI BẢO (TRIỀU NGUYỄN)
      const goldSealMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.15,
      })

      // Đế ấn hình vuông 2 tầng
      const baseGeo = new THREE.BoxGeometry(1.4, 0.4, 1.4)
      const sealBase = new THREE.Mesh(baseGeo, goldSealMat)
      sealBase.position.y = -0.3
      sealBase.castShadow = true
      artifactGroup.add(sealBase)

      const baseStepGeo = new THREE.BoxGeometry(1.2, 0.15, 1.2)
      const sealBaseStep = new THREE.Mesh(baseStepGeo, goldSealMat)
      sealBaseStep.position.y = -0.05
      sealBaseStep.castShadow = true
      artifactGroup.add(sealBaseStep)

      // Quai rồng cuộn đứng (Imperial dragon handle)
      const dragonBody = new THREE.TorusKnotGeometry(0.42, 0.14, 80, 20, 2, 3)
      const dragon = new THREE.Mesh(dragonBody, goldSealMat)
      dragon.position.y = 0.5
      dragon.castShadow = true
      artifactGroup.add(dragon)

      // Đầu rồng ngẩng cao
      const headGeo = new THREE.ConeGeometry(0.18, 0.35, 16)
      const dragonHead = new THREE.Mesh(headGeo, goldSealMat)
      dragonHead.position.set(0, 0.95, 0.3)
      dragonHead.rotation.x = Math.PI / 3
      artifactGroup.add(dragonHead)

      // Sừng rồng đôi
      for (let s = -1; s <= 1; s += 2) {
        const hornGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.28, 8)
        const horn = new THREE.Mesh(hornGeo, goldSealMat)
        horn.position.set(s * 0.1, 1.08, 0.2)
        horn.rotation.x = -Math.PI / 6
        artifactGroup.add(horn)
      }
    } else if (modelType === 'buddha_statue') {
      // 3. TƯỢNG PHẬT BÀ QUAN ÂM NGHÌN MẮT NGHÌN TAY (CHÙA BÚT THÁP)
      const lacqueredGoldMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.85,
      })
      const vermilionMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b, // Màu sơn son
        roughness: 0.4,
      })

      // Đài sen (Lotus pedestal)
      const lotusBase = new THREE.CylinderGeometry(1.1, 1.3, 0.35, 32)
      const lotus = new THREE.Mesh(lotusBase, vermilionMat)
      lotus.position.y = -0.7
      artifactGroup.add(lotus)

      // Thân tượng Phật ngồi kiết già
      const torsoGeo = new THREE.CylinderGeometry(0.45, 0.75, 0.9, 24)
      const torso = new THREE.Mesh(torsoGeo, lacqueredGoldMat)
      torso.position.y = -0.15
      torso.castShadow = true
      artifactGroup.add(torso)

      // Đầu tượng với mũ miện thanh tịnh
      const headGeo = new THREE.SphereGeometry(0.32, 24, 24)
      const head = new THREE.Mesh(headGeo, lacqueredGoldMat)
      head.position.y = 0.55
      artifactGroup.add(head)

      const crownGeo = new THREE.ConeGeometry(0.24, 0.4, 16)
      const crown = new THREE.Mesh(crownGeo, lacqueredGoldMat)
      crown.position.y = 0.88
      artifactGroup.add(crown)

      // Vầng hào quang nghìn mắt nghìn tay tỏa tròn phía sau lưng
      const haloDiscGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.05, 48)
      const halo = new THREE.Mesh(haloDiscGeo, lacqueredGoldMat)
      halo.position.set(0, 0.35, -0.25)
      halo.rotation.x = Math.PI / 2
      halo.castShadow = true
      artifactGroup.add(halo)

      // Vòng các cánh tay nhỏ tỏa hào quang (radiating arms rays)
      const rayCount = 28
      for (let r = 0; r < rayCount; r++) {
        const angle = (r * 2 * Math.PI) / rayCount
        const rayGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.6, 8)
        const ray = new THREE.Mesh(rayGeo, lacqueredGoldMat)
        ray.position.set(Math.cos(angle) * 1.55, 0.35 + Math.sin(angle) * 1.55, -0.25)
        ray.rotation.z = angle - Math.PI / 2
        artifactGroup.add(ray)
      }

      // Các cánh tay lớn chắp trước ngực
      const armGeo = new THREE.TorusGeometry(0.35, 0.08, 16, 24, Math.PI)
      const frontArms = new THREE.Mesh(armGeo, lacqueredGoldMat)
      frontArms.position.set(0, -0.1, 0.3)
      artifactGroup.add(frontArms)
    } else if (modelType === 'blue_white_vase') {
      // 4. BÌNH GỐM HOA LAM CHU ĐẬU
      const porcelainTexture = createChuDauPorcelainTexture()
      const porcelainMat = new THREE.MeshStandardMaterial({
        map: porcelainTexture,
        roughness: 0.12,
        metalness: 0.05,
      })

      // Dáng củ tỏi: thân phình cân đối
      const vaseBodyGeo = new THREE.SphereGeometry(0.95, 48, 48)
      vaseBodyGeo.scale(1, 1.25, 1)
      const vaseBody = new THREE.Mesh(vaseBodyGeo, porcelainMat)
      vaseBody.position.y = 0.05
      vaseBody.castShadow = true
      artifactGroup.add(vaseBody)

      // Cổ bình thon dài
      const neckGeo = new THREE.CylinderGeometry(0.28, 0.48, 0.85, 32)
      const vaseNeck = new THREE.Mesh(neckGeo, porcelainMat)
      vaseNeck.position.y = 1.15
      vaseNeck.castShadow = true
      artifactGroup.add(vaseNeck)

      // Miệng bình củ tỏi loe nhẹ
      const lipGeo = new THREE.TorusGeometry(0.3, 0.06, 16, 32)
      const cobaltRimMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.2 })
      const lip = new THREE.Mesh(lipGeo, cobaltRimMat)
      lip.rotation.x = Math.PI / 2
      lip.position.y = 1.58
      artifactGroup.add(lip)

      // Chân đế vững chãi
      const baseGeo = new THREE.CylinderGeometry(0.65, 0.72, 0.25, 32)
      const vaseFoot = new THREE.Mesh(baseGeo, cobaltRimMat)
      vaseFoot.position.y = -0.92
      artifactGroup.add(vaseFoot)
    } else if (modelType === 'court_hat') {
      // 5. MŨ QUAN NHẤT PHẨM TRIỀU NGUYỄN
      const blackHorsehairMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.8,
        metalness: 0.1,
      })
      const goldFiligreeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.2,
      })
      const rubyMat = new THREE.MeshStandardMaterial({
        color: 0xbe123c, // San hô đỏ
        roughness: 0.1,
      })

      // Thân mũ phốc đan mắt cáo
      const capDomeGeo = new THREE.SphereGeometry(0.85, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2)
      capDomeGeo.scale(1, 1.1, 1.1)
      const cap = new THREE.Mesh(capDomeGeo, blackHorsehairMat)
      cap.position.y = -0.3
      cap.castShadow = true
      artifactGroup.add(cap)

      // Hai cánh chuồn xòe ngang đặc trưng (Wing flaps)
      for (let side = -1; side <= 1; side += 2) {
        const wingGeo = new THREE.BoxGeometry(1.2, 0.25, 0.04)
        const wing = new THREE.Mesh(wingGeo, blackHorsehairMat)
        wing.position.set(side * 1.25, 0.1, -0.55)
        wing.rotation.z = side * 0.1
        artifactGroup.add(wing)

        // Viền vàng cánh chuồn
        const wingRimGeo = new THREE.BoxGeometry(1.22, 0.04, 0.05)
        const wingRim = new THREE.Mesh(wingRimGeo, goldFiligreeMat)
        wingRim.position.set(side * 1.25, 0.23, -0.55)
        artifactGroup.add(wingRim)
      }

      // Họa tiết lưỡng long chầu nhật phía trước trán mũ
      const dragonEmblem = new THREE.TorusGeometry(0.35, 0.06, 16, 32, Math.PI)
      const emblem = new THREE.Mesh(dragonEmblem, goldFiligreeMat)
      emblem.position.set(0, 0.2, 0.85)
      emblem.rotation.x = Math.PI / 4
      artifactGroup.add(emblem)

      // Đỉnh mũ với núm ngọc và san hô đỏ
      const finialGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.35, 16)
      const finial = new THREE.Mesh(finialGeo, goldFiligreeMat)
      finial.position.y = 0.72
      artifactGroup.add(finial)

      const jewelGeo = new THREE.SphereGeometry(0.1, 16, 16)
      const jewel = new THREE.Mesh(jewelGeo, rubyMat)
      jewel.position.y = 0.92
      artifactGroup.add(jewel)
    }

    scene.add(artifactGroup)

    // Touch & Mouse Rotation Interactions
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      artifactGroup.rotation.y += deltaX * 0.008
      artifactGroup.rotation.x += deltaY * 0.008
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    let initialPinchDist = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        initialPinchDist = Math.sqrt(dx * dx + dy * dy)
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - prevMousePos.x
        const deltaY = e.touches[0].clientY - prevMousePos.y
        artifactGroup.rotation.y += deltaX * 0.008
        artifactGroup.rotation.x += deltaY * 0.008
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const diff = dist - initialPinchDist
        camera.position.z = Math.max(3, Math.min(10, camera.position.z - diff * 0.02))
        initialPinchDist = dist
      }
    }

    const onTouchEnd = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(3, Math.min(10, camera.position.z + e.deltaY * 0.004))
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    container.addEventListener('wheel', onWheel, { passive: false })

    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isDragging) {
        artifactGroup.rotation.y += 0.003
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [loading, artifact])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#f1f5f9',
        overflow: 'hidden',
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Header Controls */}
      <header
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-gold)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
            {artifact?.name || 'Mô hình 3D'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
            XOAY 360° • CHI TIẾT HOA VĂN THỰC TẾ
          </div>
        </div>

        <div style={{ width: 44 }} />
      </header>

      {/* Touch Help Overlay Hint at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          maxWidth: 420,
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#334155',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <span>👆 Vuốt 1 ngón / giữ chuột để xoay</span>
        <span>•</span>
        <span>✌️ Lăn chuột để zoom</span>
      </div>
    </div>
  )
}

export default ViewerPage
