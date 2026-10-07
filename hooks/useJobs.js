"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "jobs"), where("active", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ docId: doc.id, ...doc.data() }))
          // newest first (client-side, so no composite index is needed)
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
          );
        setJobs(data);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to load jobs:", err);
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { jobs, isLoading, error };
}