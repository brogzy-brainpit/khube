import Link from 'next/link';

export default function index() {
  return (
    <div className={` flex justify-center gap-4 lg:gap-10 font-body text-para w-full text-brand-white `}>
        <Link href={"/"}>Awwwards</Link>
        <Link href={"/"}>Instagram</Link>
        <Link href={"/"}>Dribble</Link>
        <Link href={"/"}>LinkedIn</Link>
    </div>
  )
}
