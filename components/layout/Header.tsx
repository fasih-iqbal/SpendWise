"use client";
import { useEffect, useState } from "react";
import { getGreeting, getGreetingEmoji } from "@/lib/utils";

interface Props {
  userName?: string;
  avatarUrl?: string;
  /** 'minimal' = no greeting, no username, no currency, no avatar */
  variant?: 'default' | 'minimal';
  /** Optional content rendered on the right (icons, shortcuts). */
  rightSlot?: React.ReactNode;
}

export function Header({ userName = "there", avatarUrl, variant = 'default', rightSlot }: Props) {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    const update = () => {
      setGreeting(getGreeting());
      setEmoji(getGreetingEmoji());
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (variant === 'minimal') {
    return (
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 20px 14px",
          background: "#EDE4D8",
          position: "sticky",
          top: 0,
          zIndex: 10,
          minHeight: 64,
        }}
      />
    );
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px 14px",
        background: "#EDE4D8",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 12,
            color: "#A8998A",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
            minHeight: 16,
          }}
        >
          {emoji && <span>{emoji}</span>}
          <span>{greeting}</span>
        </p>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: "#1A1410",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Welcome, <span style={{ fontWeight: 800 }}>{userName}</span>
        </h1>
      </div>
      {rightSlot && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          {rightSlot}
        </div>
      )}
    </header>
  );
}
