import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import { useComments, useAddComment, useToggleLike, useDeleteComment } from "@/hooks/useComments";
import { useDeputy } from "@/hooks/useDeputy";

export const Route = createFileRoute("/_app-layout/deputies/$deputyId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deputyId } = Route.useParams();
  const { isAuthenticated, login } = useAuth();
  const [commentText, setCommentText] = useState("");

  const parsedId = Number(deputyId);
  const { data: comments = [], isLoading: commentsLoading } = useComments(parsedId, 0, 0, 0);
  const addComment = useAddComment(parsedId, 0, 0, 0);
  const toggleLike = useToggleLike();
  const deleteComment = useDeleteComment();
  const [isPosting, setIsPosting] = useState(false);
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});
  const [pendingDeletes, setPendingDeletes] = useState<Record<string, boolean>>({});

  async function handleSubmit() {
    if (!commentText.trim()) return;
    try {
      setIsPosting(true);
      await addComment.mutateAsync({ content: commentText });
      setCommentText("");
    } catch (e) {
      console.error("Failed to post comment", e);
    } finally {
      setIsPosting(false);
    }
  }

  const { data: deputyData, isLoading: deputyLoading } = useDeputy(parsedId);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Karta profilowa posła */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm flex items-start gap-8 transition-colors">
        <div className="w-32 h-32 bg-gray-200 dark:bg-slate-700 rounded-full shrink-0 flex items-center justify-center font-bold text-gray-400 dark:text-gray-500">
          Zdjęcie
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
            {deputyLoading ? 'Wczytywanie posła...' : deputyData ? `${deputyData.firstName} ${deputyData.lastName}` : `Poseł ID: ${deputyId}`}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {deputyData?.club ?? 'Klub Parlamentarny (Mock)'} • {deputyData?.districtName ?? ''}
          </p>
          <div className="flex gap-4 pt-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-transparent dark:border-emerald-800/50 px-4 py-2 rounded-lg font-bold">
              Frekwencja: {deputyData?.attendanceRate ?? '—'}%
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-transparent dark:border-blue-800/50 px-4 py-2 rounded-lg font-bold">
              Głosowań: {/* TODO: fetch votings count */} —
            </div>
          </div>
        </div>
      </div>

      {/* Sekcja Wykresów */}
      <div className="h-64 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 border-dashed transition-colors">
        Miejsce na wykres analityczny (Recharts) np. Zgodność głosowań z partią
      </div>

      {/* Moduł Społecznościowy */}
      <div className="pt-8 border-t border-gray-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Społeczność
        </h2>

        {isAuthenticated ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm mb-8 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Dodaj swoją opinię
            </h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon-800 dark:focus:ring-maroon-600 transition-colors resize-none"
              rows={4}
              placeholder="Co sądzisz o ostatnich działaniach tego posła?"
            ></textarea>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setCommentText("")}
                className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-full hover:opacity-90 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPosting}
                className="bg-maroon-800 dark:bg-maroon-700 text-white font-bold py-2.5 px-6 rounded-full hover:bg-maroon-900 dark:hover:bg-maroon-600 transition-colors cursor-pointer shadow-md"
              >
                {isPosting ? "Wysyłanie..." : "Opublikuj komentarz"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm mb-8 flex flex-col items-center justify-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
              Musisz być zalogowanym obywatelem, aby wziąć udział w debacie i
              oceniać posłów.
            </p>
            <button
              onClick={() => login(`/deputies/${deputyId}`)}
              className="bg-maroon-800 dark:bg-maroon-700 text-white font-bold py-2.5 px-8 rounded-full hover:bg-maroon-900 dark:hover:bg-maroon-600 transition-colors cursor-pointer shadow-md"
            >
              Zaloguj się przez Keycloak
            </button>
          </div>
        )}

        <div className="space-y-4">
          {commentsLoading ? (
            <div className="text-center text-gray-500">Wczytywanie komentarzy...</div>
          ) : (
            (comments as any[]).map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{c.authorName ?? 'Anonim'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(c.createdAt ?? Date.now()).toLocaleString()}</div>
                    <div className="mt-2 text-gray-800 dark:text-gray-200">{c.content}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={async () => {
                        setPendingLikes((s) => ({ ...s, [c.id]: true }));
                        try {
                          await toggleLike.mutateAsync(c.id);
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setPendingLikes((s) => {
                            const copy = { ...s };
                            delete copy[c.id];
                            return copy;
                          });
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-maroon-800"
                    >
                      ❤️ {c.likeCount ?? 0} {pendingLikes[c.id] ? '...' : ''}
                    </button>
                    {isAuthenticated && (
                      <button
                        onClick={async () => {
                          setPendingDeletes((s) => ({ ...s, [c.id]: true }));
                          try {
                            await deleteComment.mutateAsync(c.id);
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setPendingDeletes((s) => {
                              const copy = { ...s };
                              delete copy[c.id];
                              return copy;
                            });
                          }
                        }}
                        className="text-xs text-red-600"
                      >
                        Usuń {pendingDeletes[c.id] ? '...' : ''}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
