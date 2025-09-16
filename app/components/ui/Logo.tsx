import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 120, height = 120, className = '' }: LogoProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Image
        src="/logo192.png"
        alt="Alicit Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
}