import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "react-responsive";

export default function Scene({className='',image='/images/astonBig.png'}) {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  const mouseRef = useRef(0);
   const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' })
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);

    const handleMouse = (e) => {
      mouseRef.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const GlassPlane = () => {
    const texture = useLoader(THREE.TextureLoader, image);
const imgAspect = texture.image.width / texture.image.height;
    const { viewport } = useThree();
let planeWidth = viewport.width;
let planeHeight = viewport.height;

// Cover the screen
if (viewport.width / viewport.height > imgAspect) {
  // screen wider than image → match width
  planeHeight = viewport.width / imgAspect;
} else {
  // screen taller than image → match height
  planeWidth = viewport.height * imgAspect;
}

   const material = useMemo(() =>  new THREE.ShaderMaterial({
      uniforms: {
        iChannel0: { value: texture },
        // iResolution: { value: [size[0], size[1], 1] },
        iTime: { value: 0 },
        mouse: { value: [0, 0] },
      },
      fragmentShader: `
       // const float NUM_STRIPES = 38.0;
        const float NUM_STRIPES =${isTabletOrMobile?'50.0':'100.0'};
        //const float STRRENGTH = 18.0;
        const float STRRENGTH = 30.0;
        const float SOFTNESS = 0.00007;
        uniform sampler2D iChannel0;
        uniform vec3 iResolution;
        uniform float iTime;
        uniform vec2 mouse;
        varying vec2 vUv;

        float displacement(float x,float num_stripes,float strength){
          float modulus = 1.0 / num_stripes;
          return mod(x, modulus) * strength;
        }

        float fractal_glass(float x){
          float d = 0.0;
          for(int i=-5;i<=5;i++){
            d += displacement(x + float(i)*SOFTNESS, NUM_STRIPES, STRRENGTH);
          }
          return d / 11.0;
        }

      void main(){
  vec2 uv = vUv;

  float distort = fractal_glass(uv.x);

  vec2 imgUv = uv;

  // move image UP
  // imgUv.y += 0.15;

  // imgUv.x += distort * 0.1;
  // imgUv.x += mouse.x * 0.03;

    // move image UP
   imgUv.y += 0.20;
  //imgUv.y -= 0.0101;

  imgUv.x += distort * 0.08;
  imgUv.x += mouse.x * 0.04;

  vec3 col = texture2D(iChannel0, imgUv).rgb;
  gl_FragColor = vec4(col,1.0);
}

      `,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
      `,
    }), [texture, planeWidth, planeHeight]);


    ;

    useFrame((state) => {
      material.uniforms.mouse.value[0] = THREE.MathUtils.lerp(
        material.uniforms.mouse.value[0],
        mouseRef.current,
        0.05
      );
    });

    return (
      // <mesh material={material} scale={[18, 10, 0]}>
      //   <planeGeometry args={[1, 1]} />
      // </mesh>
    //    <mesh>
    //   {/* 👇 THIS is the key */}
    //   <planeGeometry args={[viewport.width, viewport.height]} />
    //   <primitive object={material} attach="material" />
    // </mesh>
    <mesh>
  <planeGeometry args={[planeWidth, planeHeight]} />
  <primitive object={material} attach="material" />
</mesh>

    );
  };

  return (
    <div className={`overflow-hidden w-full h-full ${className}`}>
      <Canvas className="w-full h-full">
        <GlassPlane />
      </Canvas>
    </div>
  );
}
