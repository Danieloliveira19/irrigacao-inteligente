"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().includes("@") && senha.trim().length >= 3;
  }, [email, senha]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Informe um e-mail válido e uma senha.");
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem("user_id", "1");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={S.page}>
      {/* LADO ESQUERDO */}
      <section style={S.left}>
        <div
          style={{
            ...S.leftBg,
            backgroundImage: "url('/imagemlogin.png')",
          }}
        />
        <div style={S.leftOverlay} />

        {/* LOGO BRANCA AJUSTADA */}
        <div style={S.leftLogo}>
          <img
            src="/logobranca.png"
            alt="Irriva"
            style={{ width: 62, height: 62 }}
          />
        </div>

        <div style={S.leftContent}>
          <h1 style={S.leftTitle}>
            Controle inteligente da irrigação, simples como deve ser.
          </h1>

          <p style={S.leftSubtitle}>
            Gerencie suas culturas, acompanhe a irrigação e economize água com
            tecnologia acessível.
          </p>
        </div>
      </section>

      {/* LADO DIREITO */}
      <section style={S.right}>
        <div style={S.card}>
          {/* Marca */}
          <div style={S.brandRow}>
            <img
              src="/logoverde.png"
              alt="Irriva"
              style={{ width: 48, height: 48 }}
            />
            <span style={S.brandName}>Irriva</span>
          </div>

          <h2 style={S.title}>Bem-vindo de volta!</h2>
          <p style={S.subtitle}>Entre para acompanhar suas culturas</p>

          <form onSubmit={onSubmit} style={S.form}>
            <label style={S.label}>E-mail</label>
            <input
              style={S.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label style={{ ...S.label, marginTop: 16 }}>Senha</label>
            <div style={S.passWrap}>
              <input
                style={S.inputPass}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type={showPass ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={S.eyeBtn}
              >
                👁️
              </button>
            </div>

            {error && <div style={S.errorBox}>{error}</div>}

            <button type="submit" style={S.primaryBtn} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p style={S.bottomText}>
              Não tem uma conta?{" "}
              <Link href="/register" style={S.bottomLink}>
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  // LEFT
  left: { position: "relative", overflow: "hidden" },

  leftBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  leftOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(9,58,36,0.78), rgba(9,58,36,0.45))",
  },

  // 🔥 AJUSTE AQUI SE QUISER MAIS FINO
  leftLogo: {
    position: "absolute",
    left: 44,
    bottom: 215, // ajustado para ficar onde você marcou
    width: 74,
    height: 74,
    display: "grid",
    placeItems: "center",
    background: "transparent",
  },

  leftContent: {
    position: "absolute",
    left: 44,
    bottom: 64,
    right: 44,
    color: "#fff",
    maxWidth: 760,
  },

  leftTitle: {
    margin: 0,
    fontSize: 36,
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: -0.3,
    maxWidth: 700,
  },

  leftSubtitle: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 1.6,
    opacity: 0.9,
    maxWidth: 520,
  },

  // RIGHT
  right: {
    background: "#f7f7f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 56,
  },

  card: { width: "min(640px, 100%)" },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  brandName: {
    fontWeight: 900,
    fontSize: 30,
    color: "#0c3d25",
  },

  title: {
    margin: 0,
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#0c3d25",
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 24,
    fontSize: 15,
    color: "rgba(0,0,0,0.65)",
  },

  form: {
    background: "#fff",
    borderRadius: 18,
    padding: 28,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
  },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 14px",
    fontSize: 14,
  },

  passWrap: { position: "relative" },

  inputPass: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 54px 0 14px",
    fontSize: 14,
  },

  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 9,
    height: 30,
    width: 40,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    cursor: "pointer",
  },

  errorBox: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 12,
    background: "rgba(255, 0, 0, 0.1)",
    color: "#8b0000",
    fontWeight: 600,
    fontSize: 13,
  },

  primaryBtn: {
    marginTop: 18,
    width: "100%",
    height: 54,
    borderRadius: 14,
    border: "2px solid rgba(0,0,0,0.18)",
    background: "#1f7a4d",
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },

  bottomText: {
    marginTop: 16,
    fontSize: 13,
    textAlign: "center",
  },

  bottomLink: {
    color: "#1f7a4d",
    fontWeight: 800,
    textDecoration: "none",
  },
};
