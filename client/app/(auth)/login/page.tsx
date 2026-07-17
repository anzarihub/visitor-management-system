import Login from '@/components/auth/login';

export default function LoginPage() {
   return (
      // <div className="min-h-screen w-full bg-white relative">
      //    {/* Emerald Glow Background */}
      //    <div
      //       className="absolute inset-0 z-0"
      //       style={{
      //          backgroundImage: `
      //   radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #8FFFB0 100%)
      // `,
      //          backgroundSize: '100% 100%',
      //       }}
      //    />
      //    <div className="relative z-10">
      //       <Login />
      //    </div>
      // </div>
      // <div className="min-h-screen w-full bg-white relative">
      //    {/* Combined dot pattern + emerald glow */}
      //    <div
      //       className="absolute inset-0 z-0"
      //       style={{
      //          backgroundImage: `
      //   radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0),
      //   radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #8FFFB0 100%)
      // `,
      //          backgroundSize: '20px 20px, 100% 100%',
      //       }}
      //    />
      //    <div className="relative z-10">
      //       <Login />
      //    </div>
      // </div>
      // <div className="min-h-screen w-full bg-white relative">
      //    {/* Emerald Glow Background — always fully visible */}
      //    <div
      //       className="absolute inset-0 z-0"
      //       style={{
      //          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #8FFFB0 100%)`,
      //          backgroundSize: '100% 100%',
      //       }}
      //    />

      //    {/* Diagonal Grid — fades out toward the top via mask */}
      //    <div
      //       className="absolute inset-0 z-0"
      //       style={{
      //          backgroundImage: `
      //   linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
      //   linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      // `,
      //          backgroundSize: '40px 40px',
      //          WebkitMaskImage:
      //             'radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)',
      //          maskImage:
      //             'radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)',
      //       }}
      //    />

      //    <div className="relative z-10">
      //       <Login />
      //    </div>
      // </div>

      <div className="min-h-screen w-full relative">
         {/* Layer 1: Emerald Glow */}
         <div
            className="absolute inset-0 z-0"
            style={{
               backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #8FFFB0 100%)`,
               backgroundSize: '100% 100%',
            }}
         />

         {/* Layer 2: Dashed Grid */}
         <div
            className="absolute inset-0 z-0"
            style={{
               backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 0',
               maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
               WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
               maskComposite: 'intersect',
               WebkitMaskComposite: 'source-in',
            }}
         />

         {/* Content */}
         <div className="relative z-10">
            <Login />
         </div>
      </div>
   );
}
