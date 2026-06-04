import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "30px",
            color: "#ef4444",
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            margin: "40px auto",
            maxWidth: "800px",
            borderRadius: "12px",
            fontFamily: "monospace",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
            Application Error (Caught by ErrorBoundary)
          </h2>
          <p style={{ fontWeight: "bold" }}>{this.state.error?.toString()}</p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#ffffff",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid #f3f4f6",
              fontSize: "12px",
              lineHeight: "1.5",
              marginTop: "15px",
              overflowX: "auto",
            }}
          >
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#ef4444",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
