"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Login MVP (sem backend ainda)
      if (!email.includes("@") || senha.length < 3) {
        throw new Error("Informe um e-mail válido e uma senha.");
      }

      // usuário fixo por enquanto
      localStorage.setItem("user_id", "1");

      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* LADO ESQUERDO - IMAGEM */}
      <section style={styles.left}>
        <div style={styles.leftOverlay} />

        <div style={styles.leftContent}>
          <h1 style={styles.leftTitle}>
            Irrigação inteligente,
            <br />
            simples como deve ser.
          </h1>

          <p style={styles.leftSubtitle}>
            Gerencie suas culturas, acompanhe a irrigação e economize água com tecnologia acessível.
          </p>
        </div>
      </section>

      {/* LADO DIREITO - LOGIN */}
      <section style={styles.right}>
        <div style={styles.card}>
          <div style={styles.brandRow}>
            <Image src="/file.svg" alt="Irriva" width={28} height={28} />
            <span style={styles.brandName}>Irriva</span>
          </div>

          <h2 style={styles.welcome}>Bem-vindo de volta!</h2>
          <p style={styles.desc}>Entre para acompanhar suas culturas</p>

          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label style={{ ...styles.label, marginTop: 14 }}>Senha</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {error && <div style={styles.errorBox}>{error}</div>}

            <button type="submit" style={styles.primaryBtn} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p style={styles.bottomText}>
              (MVP) Qualquer e-mail válido entra por enquanto.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
  },

  left: {
    position: "relative",
    backgroundImage: "url('/imagemlogin.png')", // 👈 SUA IMAGEM
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  leftOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(20, 90, 60, 0.8), rgba(20, 90, 60, 0.5))",
  },

  leftContent: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 48,
    color: "white",
  },

  leftTitle: {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
  },

  leftSubtitle: {
    marginTop: 14,
    fontSize: 16,
    opacity: 0.9,
    maxWidth: 520,
  },

  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f8f7",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 480,
    background: "white",
    borderRadius: 18,
    padding: 32,
    border: "1px solid #e5e5e5",
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  brandName: {
    fontSize: 18,
    fontWeight: 900,
    color: "#145a3c",
  },

  welcome: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 34,
    fontWeight: 900,
    color: "#145a3c",
  },

  desc: {
    marginTop: 0,
    marginBottom: 20,
    opacity: 0.75,
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #ddd",
    padding: "0 14px",
    fontSize: 14,
    marginBottom: 10,
  },

  primaryBtn: {
    height: 46,
    borderRadius: 12,
    border: "none",
    background: "#1f7a4a",
    color: "white",
    fontWeight: 900,
    marginTop: 8,
    cursor: "pointer",
  },

  errorBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#ffecec",
    color: "#8b0000",
    fontSize: 13,
    fontWeight: 700,
  },

  bottomText: {
    marginTop: 14,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
};
