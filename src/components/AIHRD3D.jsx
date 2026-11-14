import React, { useRef, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Error Boundary agar Canvas 3D tidak pernah merusak render seluruh halaman jika terjadi error WebGL
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.error('3D Canvas error:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
          <span>Memuat ulang avatar 3D...</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * 3D Model Character Elon Musk
 */
function ElonMuskModel({ effectiveStatus }) {
  const groupRef = useRef();
  const faceMeshRef = useRef(null);
  const { scene } = useGLTF('/elon_musk.glb');
  const baseY = -1.54;

  // Deteksi mesh wajah yang memiliki native morph target 'mouthOpen'
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetInfluences && child.morphTargetInfluences.length > 0) {
        faceMeshRef.current = child;
      }
    });
  }, [scene]);

  // Fisika gerak, pernafasan, dan gestur kepala Elon Musk 60 FPS
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Gerakan Mulut & Artikulasi Rahang saat Elon Berbicara (Lip-Sync Realistis)
    let targetMouth = 0;
    if (effectiveStatus === 'speaking') {
      const wave1 = Math.sin(time * 14.0);
      const wave2 = Math.sin(time * 24.0);
      const wave3 = Math.cos(time * 7.5);
      const speechPower = Math.max(0, (wave1 * 0.45 + wave2 * 0.3 + 0.4) * (0.75 + wave3 * 0.25));
      targetMouth = Math.min(1.0, speechPower * 0.95);
    }

    if (faceMeshRef.current && faceMeshRef.current.morphTargetInfluences) {
      faceMeshRef.current.morphTargetInfluences[0] = THREE.MathUtils.lerp(
        faceMeshRef.current.morphTargetInfluences[0] || 0,
        targetMouth,
        0.35
      );
    }

    // 2. Pernafasan alami
    const breath = Math.sin(time * 1.6);
    const breathY = breath * 0.003;

    // 3. Tatapan mata halus merespons kursor mouse kandidat
    let targetRotX = -state.pointer.y * 0.035;
    let targetRotY = state.pointer.x * 0.045;
    let targetRotZ = 0;

    // 3. Gestur interaktif sesuai status wawancara
    if (effectiveStatus === 'speaking') {
      // Artikulasi ritmis saat Elon Musk menjelaskan pertanyaan/analisis
      targetRotX += Math.sin(time * 3.8) * 0.022 + Math.sin(time * 7.0) * 0.012;
      targetRotY += Math.cos(time * 2.5) * 0.018;
      targetRotZ += Math.sin(time * 1.8) * 0.008;
    } else if (effectiveStatus === 'listening') {
      // Mengangguk menyimak jawaban kandidat
      const nod = (time % 3.2) / 3.2;
      if (nod < 0.25) {
        targetRotX += Math.sin((nod / 0.25) * Math.PI) * 0.045;
      }
      targetRotY += Math.cos(time * 0.8) * 0.01;
      targetRotZ += 0.012;
    } else if (effectiveStatus === 'thinking') {
      // Sikap berpikir mendalam khas Elon Musk (first principles thinking)
      targetRotX += -0.028;
      targetRotY += 0.038;
      targetRotZ += 0.03;
    } else {
      // Idle santai & berwibawa
      targetRotX += Math.sin(time * 0.8) * 0.008;
      targetRotY += Math.cos(time * 0.6) * 0.01;
    }

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.06);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, baseY + breathY, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, baseY, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/elon_musk.glb');

/**
 * Stage Studio 3D dengan Pencahayaan Hangat Natural Selaras dengan Kantor Eksekutif
 */
export default function AIHRD3D({ effectiveStatus = 'idle' }) {
  return (
    <CanvasErrorBoundary>
      <div className="ai-hrd-3d-canvas-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0.12, 0.82], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          {/* Pencahayaan Ruangan Studio Cerah */}
          <ambientLight intensity={1.8} color="#ffffff" />
          
          {/* Key Light Studio dari Depan Kanan Atas */}
          <directionalLight 
            position={[2.5, 3.2, 2.5]} 
            intensity={2.2} 
            color="#fffaf0" 
            castShadow 
          />
          
          {/* Soft Fill Light dari Sebelah Kiri */}
          <directionalLight 
            position={[-2.5, 1.8, 2.0]} 
            intensity={1.5} 
            color="#e0f2fe" 
          />
          
          {/* Rim Light / Backlight untuk Mempertegas Siluet Rambut & Setelan Jas Elon */}
          <directionalLight 
            position={[0, 2.8, -2.5]} 
            intensity={effectiveStatus === 'speaking' ? 2.5 : 1.6} 
            color={effectiveStatus === 'speaking' ? '#a5b4fc' : '#60a5fa'} 
          />

          {/* Point Light di Depan Dada & Wajah */}
          <pointLight 
            position={[0, 0.2, 1.0]} 
            intensity={0.8} 
            color="#fff8f0" 
          />

          <Suspense fallback={null}>
            <ElonMuskModel effectiveStatus={effectiveStatus} />
          </Suspense>

          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            target={[0, 0.12, 0]}
            minPolarAngle={Math.PI / 2.3}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 10}
            maxAzimuthAngle={Math.PI / 10}
            rotateSpeed={0.35}
          />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
