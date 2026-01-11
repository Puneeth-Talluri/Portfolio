import * as React from "react";

type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

export default function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#0f172a" }}>
      <h2 style={{ marginBottom: 8 }}>New contact message</h2>
      <p style={{ margin: 0 }}>
        <strong>From:</strong> {name} ({email})
      </p>
      <div style={{ marginTop: 12, padding: 12, background: "#f1f5f9", borderRadius: 6 }}>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{message}</pre>
      </div>
    </div>
  );
}

