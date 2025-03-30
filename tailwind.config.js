import fontFamily from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // สีพื้นฐานของธีมหมากรุก
        'chess': {
          'white': '#F0E3C7',       // สีขาวของกระดานหมากรุก
          'black': '#B58863',       // สีดำของกระดานหมากรุก
          'bg': '#2C2421',          // สีพื้นหลัง
          'dark': '#1A1410',        // สีเข้มสำหรับพื้นหลัง
          'gold': '#D6AD60',        // สีทองสำหรับเน้นความสำคัญ
          'silver': '#A8A39D',      // สีเงินสำหรับองค์ประกอบรอง
          'bronze': '#9E6A38',      // สีทองแดงสำหรับอันดับที่ 3
          'red': '#E63946',         // สีแดงสำหรับแจ้งเตือน
          'green': '#2A9D8F',       // สีเขียวสำหรับสถานะสำเร็จ
          'text': '#F8F9FA',        // สีข้อความหลัก
          'text-muted': '#CED4DA',  // สีข้อความรอง
        }
      },
      fontFamily: {
        sans: ['var(--font-poppins)', ...fontFamily.sans],
        serif: ['var(--font-playfair-display)', ...fontFamily.serif],
        mono: ['var(--font-roboto-mono)', ...fontFamily.mono],
      },
      backgroundImage: {
        'chess-pattern': "url('/images/chess-pattern.svg')",
        'hero-pattern': "linear-gradient(rgba(28, 25, 23, 0.8), rgba(28, 25, 23, 0.8)), url('/images/chess-bg.jpg')",
      },
      boxShadow: {
        'chess': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'chess-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'chess': '0.5rem',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}