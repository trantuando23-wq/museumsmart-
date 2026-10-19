'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Artifact3D } from '@/data/museumData'
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Layers } from 'lucide-react'

interface Artifact3DViewerProps {
  artifact: Artifact3D
  language: 'VI' | 'EN'
}

export const Artifact3DViewer: React.FC<Artifact3DViewerProps> = ({
  artifact,
  language,
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const isAutoRotateRef = useRef(autoRotate)
  isAutoRotateRef.current = autoRotate

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelGroupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    setIsLoading(true)

    // 1. Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0e1320)

    // 2. Camera setup
    const width = container.clientWidth || 400
    const height = container.clientHeight || 280
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 3.8)
    cameraRef.current = camera

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererRef.current = renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
    scene.add(ambientLight)

    // Key Light (Warm Antique Gold)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6)
    keyLight.position.set(4, 5, 4)
    keyLight.castShadow = true
    scene.add(keyLight)

    // Fill Light (Cool Cyan)
    const fillLight = new THREE.DirectionalLight(0x67e8f9, 1.3)
    fillLight.position.set(-4, 2, -3)
    scene.add(fillLight)

    // Rim Light (Neon Purple)
    const rimLight = new THREE.PointLight(0xa855f7, 2.2, 10)
    rimLight.position.set(0, 4, -3)
    scene.add(rimLight)

    // Bottom Uplight for Under-glow
    const uplight = new THREE.PointLight(0x06b6d4, 1.2, 6)
    uplight.position.set(0, -1, 1)
    scene.add(uplight)

    // Pedestal Platform with Glass Vitrine effect
    const floorGeo = new THREE.CylinderGeometry(2, 2.2, 0.12, 48)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.18,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -1.0
    floor.receiveShadow = true
    scene.add(floor)

    // Pedestal Cyan Neon Ring
    const ringGeo = new THREE.TorusGeometry(1.95, 0.02, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -0.94
    scene.add(ring)

    // 5. Build procedural high-fidelity 3D model for each of the 10 artifacts
    const modelGroup = new THREE.Group()
    modelGroupRef.current = modelGroup

    const buildModel = () => {
      switch (artifact.code) {
        case 'A01': {
          // 1. TRỐNG ĐỒNG ĐÔNG SƠN
          const bronzeMat = new THREE.MeshStandardMaterial({
            color: 0xc88242,
            metalness: 0.88,
            roughness: 0.32,
          })
          const goldReliefMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.2,
          })

          // Mặt trống
          const topGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.08, 48)
          const topMesh = new THREE.Mesh(topGeo, bronzeMat)
          topMesh.position.y = 0.55
          modelGroup.add(topMesh)

          // Ngôi sao thái dương 14 cánh
          const starGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.09, 14)
          const starMesh = new THREE.Mesh(starGeo, goldReliefMat)
          starMesh.position.y = 0.555
          modelGroup.add(starMesh)

          // Vành chim Lạc bay
          const birdRingGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 36)
          const birdRing = new THREE.Mesh(birdRingGeo, goldReliefMat)
          birdRing.rotation.x = Math.PI / 2
          birdRing.position.y = 0.595
          modelGroup.add(birdRing)

          // Tang trống loe
          const upperGeo = new THREE.CylinderGeometry(1.1, 0.82, 0.45, 48)
          const upperMesh = new THREE.Mesh(upperGeo, bronzeMat)
          upperMesh.position.y = 0.3
          modelGroup.add(upperMesh)

          // Thân trống thắt eo
          const bodyGeo = new THREE.CylinderGeometry(0.82, 0.84, 0.5, 48)
          const bodyMesh = new THREE.Mesh(bodyGeo, bronzeMat)
          bodyMesh.position.y = -0.15
          modelGroup.add(bodyMesh)

          // Chân trống loe rộng
          const baseGeo = new THREE.CylinderGeometry(0.84, 1.18, 0.4, 48)
          const baseMesh = new THREE.Mesh(baseGeo, bronzeMat)
          baseMesh.position.y = -0.55
          modelGroup.add(baseMesh)

          // 4 Quai kép đan bím thừng
          for (let i = 0; i < 4; i++) {
            const handleGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24, Math.PI)
            const handle = new THREE.Mesh(handleGeo, bronzeMat)
            const angle = (i * Math.PI) / 2
            handle.position.set(Math.cos(angle) * 0.94, 0.15, Math.sin(angle) * 0.94)
            handle.rotation.y = angle + Math.PI / 2
            handle.rotation.z = Math.PI / 2
            modelGroup.add(handle)
          }

          // 4 con cóc nổi cầu mưa
          for (let i = 0; i < 4; i++) {
            const frogGeo = new THREE.BoxGeometry(0.12, 0.07, 0.14)
            const frog = new THREE.Mesh(frogGeo, goldReliefMat)
            const angle = (i * Math.PI) / 2 + Math.PI / 4
            frog.position.set(Math.cos(angle) * 0.88, 0.61, Math.sin(angle) * 0.88)
            frog.rotation.y = -angle
            modelGroup.add(frog)
          }
          break
        }

        case 'A02': {
          // 2. ẤN VÀNG SẮC MỆNH CHI BẢO
          const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.96,
            roughness: 0.12,
          })

          // Đế ấn vuông
          const baseGeo = new THREE.BoxGeometry(1.4, 0.42, 1.4)
          const baseMesh = new THREE.Mesh(baseGeo, goldMat)
          baseMesh.position.y = -0.48
          modelGroup.add(baseMesh)

          // Tầng đệm vát
          const stepGeo = new THREE.BoxGeometry(1.22, 0.16, 1.22)
          const stepMesh = new THREE.Mesh(stepGeo, goldMat)
          stepMesh.position.y = -0.22
          modelGroup.add(stepMesh)

          // Núm ấn rồng cuộn 5 móng
          const dragonTorus = new THREE.TorusGeometry(0.48, 0.18, 24, 48, Math.PI * 1.6)
          const dragonMesh = new THREE.Mesh(dragonTorus, goldMat)
          dragonMesh.rotation.x = Math.PI / 2
          dragonMesh.rotation.z = -0.3
          dragonMesh.position.set(0, 0.22, 0)
          modelGroup.add(dragonMesh)

          // Đầu rồng ngẩng cao uy nghi
          const headGeo = new THREE.ConeGeometry(0.24, 0.55, 18)
          const headMesh = new THREE.Mesh(headGeo, goldMat)
          headMesh.rotation.x = -Math.PI / 2.8
          headMesh.position.set(0, 0.68, 0.42)
          modelGroup.add(headMesh)

          // Mắt rồng đính ngọc đỏ ruby
          const eyeGeo = new THREE.SphereGeometry(0.05, 12, 12)
          const rubyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1 })
          const leftEye = new THREE.Mesh(eyeGeo, rubyMat)
          leftEye.position.set(0.12, 0.74, 0.44)
          modelGroup.add(leftEye)
          const rightEye = new THREE.Mesh(eyeGeo, rubyMat)
          rightEye.position.set(-0.12, 0.74, 0.44)
          modelGroup.add(rightEye)
          break
        }

        case 'A03': {
          // 3. TƯỢNG PHẬT QUAN ÂM NGHÌN MẮT NGHÌN TAY
          const goldWoodMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.72,
            roughness: 0.32,
          })
          const vermilionMat = new THREE.MeshStandardMaterial({
            color: 0x991b1b,
            roughness: 0.45,
          })

          // Đài sen bệ rồng
          const lotusGeo = new THREE.CylinderGeometry(0.95, 0.75, 0.38, 24)
          const lotus = new THREE.Mesh(lotusGeo, vermilionMat)
          lotus.position.y = -0.6
          modelGroup.add(lotus)

          // Thân tượng tọa thiền
          const torsoGeo = new THREE.CylinderGeometry(0.32, 0.58, 0.85, 24)
          const torso = new THREE.Mesh(torsoGeo, goldWoodMat)
          torso.position.y = -0.08
          modelGroup.add(torso)

          // Đầu Phật & Mũ miện ngũ phương
          const headGeo = new THREE.SphereGeometry(0.25, 24, 24)
          const head = new THREE.Mesh(headGeo, goldWoodMat)
          head.position.y = 0.52
          modelGroup.add(head)

          const crownGeo = new THREE.ConeGeometry(0.2, 0.4, 18)
          const crown = new THREE.Mesh(crownGeo, goldWoodMat)
          crown.position.y = 0.8
          modelGroup.add(crown)

          // Vầng hào quang nghìn tay nan quạt
          const haloGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.04, 48)
          const halo = new THREE.Mesh(haloGeo, goldWoodMat)
          halo.rotation.x = Math.PI / 2
          halo.position.set(0, 0.48, -0.22)
          modelGroup.add(halo)

          for (let i = 0; i < 36; i++) {
            const armGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.85, 8)
            const arm = new THREE.Mesh(armGeo, goldWoodMat)
            const angle = (i * Math.PI) / 18
            arm.rotation.z = angle
            arm.position.set(Math.cos(angle) * 0.75, 0.48 + Math.sin(angle) * 0.75, -0.2)
            modelGroup.add(arm)
          }
          break
        }

        case 'A04': {
          // 4. BÌNH GỐM HOA LAM CHU ĐẬU
          const ceramicMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            metalness: 0.12,
            roughness: 0.15,
          })
          const cobaltMat = new THREE.MeshStandardMaterial({
            color: 0x1d4ed8,
            metalness: 0.25,
            roughness: 0.22,
          })

          // Miệng loe củ tỏi
          const mouthGeo = new THREE.CylinderGeometry(0.42, 0.26, 0.16, 36)
          const mouth = new THREE.Mesh(mouthGeo, ceramicMat)
          mouth.position.y = 0.82
          modelGroup.add(mouth)

          // Cổ bình men lam
          const neckGeo = new THREE.CylinderGeometry(0.26, 0.32, 0.38, 36)
          const neck = new THREE.Mesh(neckGeo, cobaltMat)
          neck.position.y = 0.56
          modelGroup.add(neck)

          // Bụng bình nở tròn căng
          const bellyGeo = new THREE.SphereGeometry(0.88, 36, 36)
          const belly = new THREE.Mesh(bellyGeo, ceramicMat)
          belly.position.y = 0.02
          belly.scale.set(1, 1.12, 1)
          modelGroup.add(belly)

          // Băng hoa văn thiên nga
          const bandGeo = new THREE.CylinderGeometry(0.89, 0.89, 0.4, 36, 1, true)
          const band = new THREE.Mesh(bandGeo, cobaltMat)
          band.position.y = 0.02
          modelGroup.add(band)

          // Chân bình
          const footGeo = new THREE.CylinderGeometry(0.5, 0.54, 0.26, 36)
          const foot = new THREE.Mesh(footGeo, ceramicMat)
          foot.position.y = -0.76
          modelGroup.add(foot)
          break
        }

        case 'A05': {
          // 5. MŨ QUAN NHẤT PHẨM TRIỀU NGUYỄN
          const velvetMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.82,
          })
          const goldFiligreeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.92,
            roughness: 0.18,
          })

          // Vòm mũ phốc đầu
          const domeGeo = new THREE.SphereGeometry(0.72, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2)
          const dome = new THREE.Mesh(domeGeo, velvetMat)
          dome.position.y = -0.3
          modelGroup.add(dome)

          // Vành mũ mạ vàng
          const rimGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.16, 36)
          const rim = new THREE.Mesh(rimGeo, goldFiligreeMat)
          rim.position.y = -0.36
          modelGroup.add(rim)

          // Tấm Bác Sơn dát vàng trước trán
          const plateGeo = new THREE.BoxGeometry(0.42, 0.36, 0.06)
          const plate = new THREE.Mesh(plateGeo, goldFiligreeMat)
          plate.position.set(0, 0.06, 0.68)
          modelGroup.add(plate)

          // Viên ngọc xanh gắn trung tâm bác sơn
          const jewelGeo = new THREE.SphereGeometry(0.09, 16, 16)
          const gemMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.1 })
          const jewel = new THREE.Mesh(jewelGeo, gemMat)
          jewel.position.set(0, 0.08, 0.72)
          modelGroup.add(jewel)

          // Hai cánh chuồn vươn ngang
          const wingGeo = new THREE.BoxGeometry(1.65, 0.13, 0.03)
          const leftWing = new THREE.Mesh(wingGeo, goldFiligreeMat)
          leftWing.position.set(1.22, 0.32, -0.2)
          leftWing.rotation.z = -0.25
          leftWing.rotation.y = 0.2
          modelGroup.add(leftWing)

          const rightWing = new THREE.Mesh(wingGeo, goldFiligreeMat)
          rightWing.position.set(-1.22, 0.32, -0.2)
          rightWing.rotation.z = 0.25
          rightWing.rotation.y = -0.2
          modelGroup.add(rightWing)
          break
        }

        case 'A06': {
          // 6. KIẾM THUẬN THIÊN - LÊ LỢI
          const steelMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.95,
            roughness: 0.15,
          })
          const goldHiltMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.95,
            roughness: 0.2,
          })
          const rubyMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            roughness: 0.1,
          })

          // Lưỡi kiếm dài sắc bén
          const bladeGeo = new THREE.BoxGeometry(0.12, 1.8, 0.03)
          const blade = new THREE.Mesh(bladeGeo, steelMat)
          blade.position.y = 0.35
          modelGroup.add(blade)

          // Mũi kiếm vát nhọn
          const tipGeo = new THREE.ConeGeometry(0.08, 0.3, 4)
          const tip = new THREE.Mesh(tipGeo, steelMat)
          tip.position.y = 1.35
          tip.rotation.y = Math.PI / 4
          modelGroup.add(tip)

          // Chuôi kiếm chạm rồng vàng (Crossguard)
          const guardGeo = new THREE.BoxGeometry(0.48, 0.1, 0.12)
          const guard = new THREE.Mesh(guardGeo, goldHiltMat)
          guard.position.y = -0.58
          modelGroup.add(guard)

          // Viên ngọc ruby đính trên cán
          const gem = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), rubyMat)
          gem.position.set(0, -0.58, 0.08)
          modelGroup.add(gem)

          // Cán cầm bọc vàng
          const hiltGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.45, 16)
          const hilt = new THREE.Mesh(hiltGeo, goldHiltMat)
          hilt.position.y = -0.85
          modelGroup.add(hilt)

          // Đốc kiếm hình hoa sen tròn
          const pommelGeo = new THREE.SphereGeometry(0.09, 16, 16)
          const pommel = new THREE.Mesh(pommelGeo, goldHiltMat)
          pommel.position.y = -1.1
          modelGroup.add(pommel)
          break
        }

        case 'A07': {
          // 7. ĐẠI HỒNG CHUNG THIÊN MỤ
          const darkBronzeMat = new THREE.MeshStandardMaterial({
            color: 0x854d0e,
            metalness: 0.85,
            roughness: 0.38,
          })
          const highlightMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.88,
            roughness: 0.28,
          })

          // Thân chuông đồng khổng lồ
          const bellGeo = new THREE.CylinderGeometry(0.65, 1.05, 1.45, 36)
          const bell = new THREE.Mesh(bellGeo, darkBronzeMat)
          bell.position.y = -0.05
          modelGroup.add(bell)

          // Đỉnh chuông vòm tròn
          const domeGeo = new THREE.SphereGeometry(0.66, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2)
          const dome = new THREE.Mesh(domeGeo, darkBronzeMat)
          dome.position.y = 0.67
          modelGroup.add(dome)

          // Quai chuông Bồ Lao (rồng 2 đầu uốn cong)
          const handleGeo = new THREE.TorusGeometry(0.35, 0.09, 16, 32, Math.PI)
          const handle = new THREE.Mesh(handleGeo, highlightMat)
          handle.rotation.x = Math.PI
          handle.position.y = 0.85
          modelGroup.add(handle)

          // 4 Núm chuông gõ chày kình
          for (let i = 0; i < 4; i++) {
            const bossGeo = new THREE.SphereGeometry(0.1, 16, 16)
            const boss = new THREE.Mesh(bossGeo, highlightMat)
            const angle = (i * Math.PI) / 2
            boss.position.set(Math.cos(angle) * 0.82, -0.05, Math.sin(angle) * 0.82)
            modelGroup.add(boss)
          }

          // Vành miệng chuông đúc hoa sen sóng nước
          const rimGeo = new THREE.TorusGeometry(1.06, 0.08, 16, 36)
          const rim = new THREE.Mesh(rimGeo, highlightMat)
          rim.rotation.x = Math.PI / 2
          rim.position.y = -0.78
          modelGroup.add(rim)
          break
        }

        case 'A08': {
          // 8. NGỌC ẤN HOÀNG ĐẾ CHI BẢO
          const jadeMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            metalness: 0.15,
            roughness: 0.12,
            transparent: true,
            opacity: 0.92,
          })

          // Đế ấn ngọc bích vuông vức
          const baseGeo = new THREE.BoxGeometry(1.35, 0.45, 1.35)
          const base = new THREE.Mesh(baseGeo, jadeMat)
          base.position.y = -0.48
          modelGroup.add(base)

          // Núm ấn rồng ngọc 5 móng
          const dragonTorus = new THREE.TorusGeometry(0.44, 0.16, 20, 36, Math.PI * 1.5)
          const dragonMesh = new THREE.Mesh(dragonTorus, jadeMat)
          dragonMesh.rotation.x = Math.PI / 2
          dragonMesh.position.set(0, 0.18, 0)
          modelGroup.add(dragonMesh)

          // Đầu rồng ngọc
          const headGeo = new THREE.ConeGeometry(0.2, 0.45, 16)
          const headMesh = new THREE.Mesh(headGeo, jadeMat)
          headMesh.rotation.x = -Math.PI / 3
          headMesh.position.set(0, 0.58, 0.38)
          modelGroup.add(headMesh)
          break
        }

        case 'A09': {
          // 9. TƯỢNG VŨ NỮ CHĂM PA APSARA
          const sandstoneMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.85,
          })
          const goldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xfde68a,
            metalness: 0.6,
            roughness: 0.3,
          })

          // Bệ sen đá sa thạch
          const baseGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.3, 24)
          const base = new THREE.Mesh(baseGeo, sandstoneMat)
          base.position.y = -0.8
          modelGroup.add(base)

          // Dáng múa Tribhanga (thân uốn 3 khúc)
          const hipsGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.45, 16)
          const hips = new THREE.Mesh(hipsGeo, sandstoneMat)
          hips.position.set(-0.06, -0.4, 0)
          hips.rotation.z = 0.15
          modelGroup.add(hips)

          const waistGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.4, 16)
          const waist = new THREE.Mesh(waistGeo, sandstoneMat)
          waist.position.set(0.05, -0.05, 0)
          waist.rotation.z = -0.18
          modelGroup.add(waist)

          const chestGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.42, 16)
          const chest = new THREE.Mesh(chestGeo, sandstoneMat)
          chest.position.set(-0.04, 0.32, 0)
          chest.rotation.z = 0.12
          modelGroup.add(chest)

          // Đầu và mũ miện nhọn Chăm Pa
          const headGeo = new THREE.SphereGeometry(0.2, 20, 20)
          const head = new THREE.Mesh(headGeo, sandstoneMat)
          head.position.set(0.04, 0.68, 0)
          modelGroup.add(head)

          const crownGeo = new THREE.ConeGeometry(0.14, 0.38, 16)
          const crown = new THREE.Mesh(crownGeo, goldTrimMat)
          crown.position.set(0.04, 0.95, 0)
          modelGroup.add(crown)

          // Tay múa dâng hoa
          const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), sandstoneMat)
          leftArm.rotation.z = -Math.PI / 3
          leftArm.position.set(-0.35, 0.45, 0)
          modelGroup.add(leftArm)

          const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), sandstoneMat)
          rightArm.rotation.z = Math.PI / 2.5
          rightArm.position.set(0.35, 0.55, 0)
          modelGroup.add(rightArm)
          break
        }

        case 'A10':
        default: {
          // 10. RỒNG ĐẤT NUNG THĂNG LONG
          const greenGlazeMat = new THREE.MeshStandardMaterial({
            color: 0x059669,
            metalness: 0.2,
            roughness: 0.22,
          })
          const goldGlazeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.3,
            roughness: 0.3,
          })

          // Bệ ngói úp hình bán nguyệt
          const tileGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.25, 24, 1, false, 0, Math.PI)
          const tile = new THREE.Mesh(tileGeo, greenGlazeMat)
          tile.rotation.z = Math.PI / 2
          tile.position.y = -0.75
          modelGroup.add(tile)

          // Thân rồng uốn khúc hình sin nhấp nhô
          for (let i = 0; i < 5; i++) {
            const segGeo = new THREE.SphereGeometry(0.22 - i * 0.02, 16, 16)
            const seg = new THREE.Mesh(segGeo, greenGlazeMat)
            const x = -0.6 + i * 0.32
            const y = -0.3 + Math.sin(i * 1.5) * 0.28
            seg.position.set(x, y, 0)
            modelGroup.add(seg)
          }

          // Đầu rồng ngẩng cao với mào lửa
          const headGeo = new THREE.ConeGeometry(0.24, 0.5, 16)
          const headMesh = new THREE.Mesh(headGeo, greenGlazeMat)
          headMesh.rotation.z = -Math.PI / 3
          headMesh.position.set(0.65, 0.38, 0)
          modelGroup.add(headMesh)

          // Mào lửa vàng rực
          const maneGeo = new THREE.ConeGeometry(0.12, 0.45, 8)
          const mane = new THREE.Mesh(maneGeo, goldGlazeMat)
          mane.rotation.z = Math.PI / 4
          mane.position.set(0.5, 0.72, 0)
          modelGroup.add(mane)
          break
        }
      }
    }

    buildModel()
    scene.add(modelGroup)
    setIsLoading(false)

    // 6. User Orbit Controls (Drag to orbit 360)
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY

      modelGroupRef.current.rotation.y += deltaX * 0.012
      modelGroupRef.current.rotation.x = Math.max(
        Math.min(modelGroupRef.current.rotation.x + deltaY * 0.012, Math.PI / 3),
        -Math.PI / 3
      )

      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseUp = () => (isDragging = false)

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch controls for mobile
    let prevTouchX = 0
    let prevTouchY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        prevTouchX = e.touches[0].clientX
        prevTouchY = e.touches[0].clientY
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && modelGroupRef.current) {
        const deltaX = e.touches[0].clientX - prevTouchX
        const deltaY = e.touches[0].clientY - prevTouchY
        modelGroupRef.current.rotation.y += deltaX * 0.015
        modelGroupRef.current.rotation.x = Math.max(
          Math.min(modelGroupRef.current.rotation.x + deltaY * 0.015, Math.PI / 3),
          -Math.PI / 3
        )
        prevTouchX = e.touches[0].clientX
        prevTouchY = e.touches[0].clientY
      }
    }
    dom.addEventListener('touchstart', onTouchStart)
    dom.addEventListener('touchmove', onTouchMove)

    // 7. Animation Loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (isAutoRotateRef.current && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.008
      }

      renderer.render(scene, camera)
    }
    animate()

    // 8. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('touchstart', onTouchStart)
      dom.removeEventListener('touchmove', onTouchMove)
      renderer.dispose()
    }
  }, [artifact])

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(cameraRef.current.position.z - 0.4, 2.0)
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(cameraRef.current.position.z + 0.4, 6.0)
    }
  }

  const handleResetView = () => {
    if (cameraRef.current && modelGroupRef.current) {
      cameraRef.current.position.set(0, 1.2, 3.8)
      modelGroupRef.current.rotation.set(0, 0, 0)
    }
  }

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0E1320] shadow-inner">
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0E1320] text-amber-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">
            {language === 'VI' ? 'Đang khởi tạo không gian 3D bảo vật...' : 'Initializing 3D spatial artifact...'}
          </span>
        </div>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-xl shadow-lg">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
              autoRotate
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tự động xoay"
          >
            <RotateCw className={`h-3 w-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{language === 'VI' ? 'Tự xoay' : 'Auto'}</span>
          </button>

          <button
            onClick={handleZoomIn}
            className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
            title="Phóng to"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleResetView}
            className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors"
            title="Đặt lại góc nhìn"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold text-slate-400 backdrop-blur-xl">
          <Layers className="h-3 w-3 text-cyan-400" />
          <span>{language === 'VI' ? '3D PBR Shaders' : 'PBR Shaders'}</span>
        </div>
      </div>
    </div>
  )
}
