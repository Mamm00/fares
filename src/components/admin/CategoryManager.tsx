"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { CategoryWithCount } from "@/lib/data";
import { KNOWN_IMAGES } from "@/lib/images";
import { slugify } from "@/lib/format";

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

const EMPTY: FormState = { name: "", slug: "", description: "", image: KNOWN_IMAGES[0].src };

export default function CategoryManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setCreating(true);
    setError("");
  }

  function startEdit(cat: CategoryWithCount) {
    setCreating(false);
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image });
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setCreating(false);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(cat: CategoryWithCount) {
    const warning =
      cat.productCount > 0
        ? `Delete "${cat.name}"? ${cat.productCount} product(s) will become uncategorized.`
        : `Delete "${cat.name}"?`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  const formOpen = creating || editingId !== null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* List */}
      <div className="border border-ink/15 bg-white shadow-[5px_5px_0_0_rgba(10,10,11,1)] xl:col-span-2">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-ink/40">
            {categories.length} CATEGORIES
          </p>
          <button
            onClick={startCreate}
            className="btn-press flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.25em] text-cream hover:bg-ember hover:text-ink"
          >
            <Plus size={13} /> NEW CATEGORY
          </button>
        </div>
        <ul className="divide-y divide-ink/10">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-cream/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.image} alt="" className="h-16 w-12 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {cat.name}
                  <span className="ml-2 font-mono text-[10px] font-normal tracking-widest text-ink/40">
                    /{cat.slug}
                  </span>
                </p>
                <p className="truncate pt-0.5 text-xs text-ink/50">{cat.description}</p>
                <p className="pt-1 font-mono text-[9px] tracking-[0.25em] text-ember">
                  {cat.productCount} PIECES
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="btn-press border border-ink/20 p-2 text-ink/60 hover:border-ink hover:text-ink"
                  aria-label="Edit category"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(cat)}
                  disabled={busy}
                  className="btn-press border border-ink/20 p-2 text-ink/60 hover:border-ember hover:text-ember"
                  aria-label="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div>
        {formOpen ? (
          <form onSubmit={save} className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl uppercase">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                type="button"
                onClick={() => { setCreating(false); setEditingId(null); }}
                className="text-ink/40 hover:text-ember"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-ink/50">NAME *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: editingId ? f.slug : slugify(e.target.value),
                    }))
                  }
                  className="w-full border border-ink/20 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-ember"
                  placeholder="Denim"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-ink/50">SLUG *</span>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  className="w-full border border-ink/20 bg-cream px-3.5 py-2.5 font-mono text-xs outline-none focus:border-ember"
                  placeholder="denim"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-ink/50">DESCRIPTION</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full resize-none border border-ink/20 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-ember"
                  placeholder="What lives in this category…"
                />
              </label>
              <div>
                <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-ink/50">COVER IMAGE</span>
                <div className="grid grid-cols-5 gap-2">
                  {KNOWN_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.src}
                      title={img.label}
                      onClick={() => setForm((f) => ({ ...f, image: img.src }))}
                      className={`relative aspect-square overflow-hidden border-2 ${
                        form.image === img.src ? "border-ember" : "border-transparent hover:border-ink/30"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="mt-3 w-full border border-ink/20 bg-cream px-3.5 py-2.5 font-mono text-xs outline-none focus:border-ember"
                  placeholder="/images/… or https://…"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 border border-ember bg-ember/10 px-3 py-2 font-mono text-[10px] tracking-widest text-ember">
                {error.toUpperCase()}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-press mt-6 flex w-full items-center justify-center gap-2 bg-ink py-3.5 font-mono text-[11px] font-bold tracking-[0.3em] text-cream hover:bg-ember hover:text-ink disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {editingId ? "SAVE CHANGES" : "CREATE CATEGORY"}
            </button>
          </form>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center border border-dashed border-ink/25 p-8 text-center">
            <p className="font-display text-2xl uppercase text-ink/40">
              Select a category
            </p>
            <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-ink/35">
              OR CREATE A NEW ONE ON THE LEFT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
