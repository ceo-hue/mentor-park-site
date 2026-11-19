import { brand } from "@/content/site";

/** 명함에서 벡터화한 행성 심볼. 이름 또는 버튼 레이블과 함께 사용한다. */
export function LogoMark({ className }: { className?: string }) {
  return <img src="/brand/symbol.svg" width={150} height={95} alt="" className={className} />;
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-start gap-[3.125%] ${className ?? ""}`}>
      <LogoMark className="mt-[1.04%] h-auto w-[52.08%] shrink-0" />
      <img src="/brand/wordmark-ko.svg" width={129} height={94} alt={brand.nameKo} className="h-auto w-[44.79%]" />
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return <img src="/brand/wordmark-en.svg" width={289} height={127} alt={brand.nameEn} className={className} />;
}
