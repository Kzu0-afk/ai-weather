"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.page}>
          <main className={styles.panel}>
            <div className={styles.content}>
              <h1 className={styles.title}>Something went wrong</h1>
              <p className={styles.message}>
                An unexpected error occurred. Please try again or return to the
                home page.
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className={styles.button}
                >
                  Try again
                </button>
                <Link href="/" className={styles.link}>
                  Go to Home
                </Link>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

