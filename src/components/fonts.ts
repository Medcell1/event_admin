import { Inter, Manrope, Open_Sans, Poppins, Rubik, Sora } from 'next/font/google'
const rubik = Rubik({
    weight: ['300', '300'],
    subsets: ['latin'],
  });
  const poppins = Poppins({
    weight: ['300', '400'],
    subsets: ['latin'],
  });
  const openSans = Open_Sans({
    weight: ['300', '400'],
    subsets: ['latin'],
  });
  const inter = Inter({
    weight: ['500', '900'],
    subsets: ['latin'],
  });
  const manRope = Manrope({
    weight: ['500', '800'],
    subsets: ['latin'],
  });
  const sora = Sora({
    weight: ['500', '800'],
    subsets: ['latin'],
  });
export const fonts = {
   poppins: poppins.className,
   inter: inter.className,
   manRope: manRope.className,
   sora: sora.className,
   rubik: rubik.className,
   openSans: openSans.className,

}