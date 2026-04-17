interface Cookie3DProps {
  size?: number;
  chips?: boolean;
  spin?: boolean;
  tilt?: number;
  className?: string;
}

export function Cookie3D({ size = 360, chips = true, spin = false, tilt = -18, className = "" }: Cookie3DProps) {
  return (
    <div
      className={`cookie3d ${spin ? "cookie3d-spin" : ""} ${className}`}
      style={{ "--c-size": size + "px", "--c-tilt": tilt + "deg" } as React.CSSProperties}
    >
      <div className="cookie3d-stage">
        <div className="cookie3d-disc cookie3d-depth cookie3d-depth-1"></div>
        <div className="cookie3d-disc cookie3d-depth cookie3d-depth-2"></div>
        <div className="cookie3d-disc cookie3d-depth cookie3d-depth-3"></div>
        <div className="cookie3d-disc cookie3d-depth cookie3d-depth-4"></div>
        <div className="cookie3d-disc cookie3d-top">
          <div className="cookie3d-grain"></div>
          {chips && (
            <>
              <span className="chip" style={{ top: "18%", left: "22%", "--s": "16px" } as React.CSSProperties}></span>
              <span className="chip" style={{ top: "34%", left: "62%", "--s": "22px" } as React.CSSProperties}></span>
              <span className="chip" style={{ top: "58%", left: "30%", "--s": "18px" } as React.CSSProperties}></span>
              <span className="chip" style={{ top: "48%", left: "70%", "--s": "14px" } as React.CSSProperties}></span>
              <span className="chip" style={{ top: "72%", left: "52%", "--s": "20px" } as React.CSSProperties}></span>
              <span className="chip" style={{ top: "28%", left: "42%", "--s": "12px" } as React.CSSProperties}></span>
              <span className="chip chip-gold" style={{ top: "42%", left: "48%", "--s": "10px" } as React.CSSProperties}></span>
              <span className="chip chip-gold" style={{ top: "64%", left: "18%", "--s": "8px" } as React.CSSProperties}></span>
            </>
          )}
          <div className="cookie3d-gloss"></div>
        </div>
      </div>
    </div>
  );
}

interface OrnamentItem {
  kind: "coin" | "bean" | "nib";
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export function FloatingOrnaments({ items }: { items: OrnamentItem[] }) {
  return (
    <div className="ornaments3d">
      {items.map((o, i) => (
        <div
          key={i}
          className={`ornament3d ornament3d-${o.kind}`}
          style={{
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            "--delay": i * 0.7 + "s",
            "--size": o.size + "px",
          } as React.CSSProperties}
        >
          <div className="ornament3d-inner">
            {o.kind === "coin" && (
              <>
                <div className="coin-face">✦</div>
                <div className="coin-face coin-back">L M</div>
                <div className="coin-edge"></div>
              </>
            )}
            {o.kind === "bean" && <div className="bean-body"></div>}
            {o.kind === "nib" && <div className="nib-body"></div>}
          </div>
        </div>
      ))}
    </div>
  );
}
