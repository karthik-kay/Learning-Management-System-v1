"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCertificate } from "@/redux/slices/certificateSlice";
import { Download, ArrowLeft } from "lucide-react";
import { Great_Vibes } from "next/font/google";
import Link from "next/link";

const CERT_BG = "/certificate-template.png";
const LOGO_IMG = "/logo-1.png";
const SIGNATURE_IMG = "/signature.png";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

// ── Patch getComputedStyle so html2canvas never sees oklch() values ──────────
// Call this once before any html2canvas invocation.
function patchGetComputedStyle() {
  const original = window.getComputedStyle.bind(window);
  // @ts-ignore
  window.getComputedStyle = (el: Element, pseudo?: string | null) => {
    const styles = original(el, pseudo);
    return new Proxy(styles, {
      get(target, prop) {
        const value = (target as any)[prop];
        if (typeof value === "string" && value.includes("oklch")) {
          // Replace any oklch(...) with a safe transparent fallback
          return value.replace(/oklch\([^)]*\)/g, "transparent");
        }
        if (typeof value === "function") return value.bind(target);
        return value;
      },
    });
  };
}

export default function CertificateDetailPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const certRef = useRef<HTMLDivElement>(null);
  const [editableName, setEditableName] = useState("");

  const { selected: cert, status } = useSelector(
    (state: RootState) => state.certificates,
  );

  useEffect(() => {
    if (credentialId) dispatch(fetchCertificate(credentialId));
  }, [credentialId, dispatch]);

  useEffect(() => {
    if (cert?.student_name) setEditableName(cert.student_name);
  }, [cert]);

  const handleDownload = async () => {
    if (!certRef.current || !cert) return;

    // Patch BEFORE importing html2canvas
    patchGetComputedStyle();

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fdf8f0",
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      0,
      0,
      canvas.width / 2,
      canvas.height / 2,
    );

    pdf.save(`certificate_${editableName.replace(/\s+/g, "_")}.pdf`);
  };

  if (status === "loading" || !cert) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid #3b82f6",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`${greatVibes.variable} p-6 flex flex-col items-center gap-6`}
    >
      {/* Back + Download */}
      <div className="flex items-center justify-between w-full max-w-4xl">
        <Link
          href="/student/certificates"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </Link>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* Certificate — zero Tailwind classes inside */}
      <div
        ref={certRef}
        style={{
          position: "relative",
          width: 780,
          height: 560,
          overflow: "hidden",
          flexShrink: 0,
          fontFamily: "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CERT_BG}
          alt=""
          aria-hidden
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_IMG}
          alt={cert.org.name}
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            top: "11%",
            left: "7.5%",
            height: "3.5%",
            width: "auto",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingLeft: 80,
            paddingRight: 80,
            gap: 4,
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              color: "#b89b4f",
              letterSpacing: "0.08em",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            CERTIFICATE OF ACHIEVEMENT
          </h1>

          <div
            style={{
              width: 200,
              height: 1,
              background:
                "linear-gradient(to right, transparent, #c9a84c, transparent)",
              marginBottom: 16,
            }}
          />

          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "#aaa",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            This is to certify that
          </p>

          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setEditableName(e.currentTarget.innerText)}
            onFocus={(e) => {
              e.currentTarget.style.borderBottom = "1px dashed #aaa";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderBottom = "none";
            }}
            style={{
              fontFamily: "var(--font-great-vibes), 'Brush Script MT', cursive",
              fontSize: "2.5rem",
              fontStyle: "italic",
              color: "#1a2744",
              letterSpacing: "0.15rem",
              outline: "none",
              cursor: "text",
            }}
          >
            {editableName}
          </p>

          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "#aaa",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            has successfully completed the requirements for
          </p>

          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#243460",
              maxWidth: 480,
            }}
          >
            {cert.course_title}
          </p>

          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "#aaa",
              textTransform: "uppercase",
              lineHeight: 1.5,
            }}
          >
            Demonstrating proficiency in frontend architecture, backend systems,
            and database management.
          </p>

          <div
            style={{
              width: 100,
              height: 1,
              background:
                "linear-gradient(to right, transparent, #9a7a32, transparent)",
              marginBottom: 20,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SIGNATURE_IMG}
                alt="Signature"
                crossOrigin="anonymous"
                style={{
                  height: 40,
                  width: "auto",
                  objectFit: "contain",
                  marginBottom: 2,
                }}
              />
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#1a2744",
                  fontFamily: "sans-serif",
                }}
              >
                {cert.org.ceo_name}
              </p>
              <p
                style={{
                  fontSize: "0.6rem",
                  color: "#999",
                  fontFamily: "sans-serif",
                }}
              >
                {cert.org.ceo_title}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#1a2744",
                  fontFamily: "sans-serif",
                }}
              >
                {issuedDate}
              </p>
              <p
                style={{
                  fontSize: "0.6rem",
                  color: "#999",
                  fontFamily: "sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Date Issued
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-mono">
        Credential ID: {cert.credential_id}
      </p>
    </div>
  );
}
