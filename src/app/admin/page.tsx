"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Settings,
  Image as ImageIcon,
  Upload,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Search,
  ChevronLeft,
  Eye,
  EyeOff,
  RefreshCw,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

/* ════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════ */

interface GalleryCard {
  id: string;
  sceneId: string;
  title: string;
  tag: string;
  image: string;
  duration: string;
  views: string;
  icon: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const ICON_OPTIONS = ["Sparkles", "TrendingUp", "Film", "Flame", "Crown", "Zap"];
const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "nature", label: "Nature" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "fantasy", label: "Fantasy" },
  { value: "abstract", label: "Abstract" },
];

const DEFAULT_CARD: Omit<GalleryCard, "id" | "createdAt" | "updatedAt"> = {
  sceneId: "",
  title: "",
  tag: "AI Preview",
  image: "",
  duration: "2:30",
  views: "10K",
  icon: "Sparkles",
  category: "all",
  order: 0,
  active: true,
};

/* ════════════════════════════════════════════════════════════════
   ADMIN PAGE
   ════════════════════════════════════════════════════════════════ */

export default function AdminPage() {
  const [cards, setCards] = useState<GalleryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showInactive, setShowInactive] = useState(false);
  const [editingCard, setEditingCard] = useState<GalleryCard | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editForm, setEditForm] = useState(DEFAULT_CARD);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryCard | null>(null);
  const [uploadCardId, setUploadCardId] = useState<string | null>(null);

  // Fetch cards
  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Filter cards
  const filteredCards = cards.filter((c) => {
    if (!showInactive && !c.active) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.sceneId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Open edit dialog
  const openEdit = (card: GalleryCard) => {
    setEditingCard(card);
    setIsNew(false);
    setEditForm({ ...card });
  };

  // Open new card dialog
  const openNew = () => {
    setEditingCard(null);
    setIsNew(true);
    const nextOrder = cards.length > 0 ? Math.max(...cards.map((c) => c.order)) + 1 : 1;
    setEditForm({ ...DEFAULT_CARD, order: nextOrder });
  };

  // Save card
  const saveCard = async () => {
    if (!editForm.title || !editForm.image) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (res.ok) {
          await fetchCards();
          setEditingCard(null);
        }
      } else if (editingCard) {
        const res = await fetch(`/api/admin/cards/${editingCard.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (res.ok) {
          await fetchCards();
          setEditingCard(null);
        }
      }
    } catch (err) {
      console.error("Failed to save card:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete card
  const deleteCard = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/cards/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCards();
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  // Toggle active
  const toggleActive = async (card: GalleryCard) => {
    try {
      const res = await fetch(`/api/admin/cards/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !card.active }),
      });
      if (res.ok) {
        await fetchCards();
      }
    } catch (err) {
      console.error("Failed to toggle active:", err);
    }
  };

  // Upload image
  const handleUpload = async (file: File, cardId?: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (cardId) formData.append("cardId", cardId);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Update form or refresh
        if (cardId) {
          setEditForm((prev) => ({ ...prev, image: data.url }));
          await fetchCards();
        } else {
          setEditForm((prev) => ({ ...prev, image: data.url }));
        }
        return data.url;
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      all: "bg-white/10 text-white/70",
      nature: "bg-emerald-500/15 text-emerald-400",
      scifi: "bg-cyan-500/15 text-cyan-400",
      fantasy: "bg-violet-500/15 text-violet-400",
      abstract: "bg-amber-500/15 text-amber-400",
    };
    return colors[cat] || colors.all;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Admin Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-violet-500">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-[11px] text-muted-foreground">Manage gallery cards & images</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/"} className="gap-2">
              <ChevronLeft className="h-3.5 w-3.5" />
              View Site
            </Button>
            <Button size="sm" onClick={openNew} className="gap-2 bg-gradient-to-r from-rose-500 to-violet-500 text-white hover:from-rose-600 hover:to-violet-600">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* ── Stats bar ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{cards.length}</p>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-emerald-400">{cards.filter((c) => c.active).length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-rose-400">{cards.filter((c) => !c.active).length}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-violet-400">
                {new Set(cards.map((c) => c.category)).size}
              </p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Filters ── */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, tag, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-white/10 bg-white/[0.03]"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[130px] border-white/10 bg-white/[0.03]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={showInactive} onCheckedChange={setShowInactive} />
              <Label className="text-xs text-muted-foreground cursor-pointer">Show inactive</Label>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchCards} className="gap-1.5 text-muted-foreground">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-3 text-sm text-muted-foreground">Loading cards...</span>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">No cards found</p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              {search || filterCategory !== "all"
                ? "Try adjusting your filters"
                : 'Click "Add Card" to create your first gallery card'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                className={`group overflow-hidden border transition-all duration-300 hover:border-rose-500/30 ${
                  card.active
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-white/5 bg-white/[0.01] opacity-60"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Order badge */}
                  <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white backdrop-blur-sm">
                    {card.order}
                  </div>

                  {/* Category badge */}
                  <Badge variant="secondary" className={`absolute right-2 top-2 text-[10px] ${categoryColor(card.category)}`}>
                    {card.category}
                  </Badge>

                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => openEdit(card)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => {
                        setUploadCardId(card.id);
                        setEditForm({ ...card });
                      }}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => toggleActive(card)}
                    >
                      {card.active ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => setDeleteTarget(card)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{card.title}</h3>
                      <p className="truncate text-[11px] text-muted-foreground">{card.tag}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      {card.duration}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/50">{card.sceneId}</span>
                    <span className="text-[10px] text-muted-foreground/50">{card.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* ── Edit / New Card Dialog ── */}
      <Dialog open={!!editingCard || isNew} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New Card" : "Edit Card"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="image" className="flex-1">Image</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Card title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-tag">Tag</Label>
                  <Input
                    id="edit-tag"
                    value={editForm.tag}
                    onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                    placeholder="AI Preview"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    placeholder="2:30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-views">Views</Label>
                  <Input
                    id="edit-views"
                    value={editForm.views}
                    onChange={(e) => setEditForm({ ...editForm, views: e.target.value })}
                    placeholder="10K"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Select value={editForm.icon} onValueChange={(v) => setEditForm({ ...editForm, icon: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sceneId">Scene ID</Label>
                <Input
                  id="edit-sceneId"
                  value={editForm.sceneId}
                  onChange={(e) => setEditForm({ ...editForm, sceneId: e.target.value })}
                  placeholder="scene-XX"
                  disabled={!isNew}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 mt-4">
              {/* Current image preview */}
              {editForm.image && (
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={editForm.image}
                    alt="Current image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Image URL input */}
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-image"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="/ai-gallery/scene-XX.png"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Enter URL or upload a file below
                </p>
              </div>

              {/* Upload button */}
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <label
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-rose-500/30 hover:bg-rose-500/5"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload (JPG, PNG, WebP, GIF — max 5MB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleUpload(file, editingCard?.id);
                        if (url) setEditForm((prev) => ({ ...prev, image: url }));
                      }
                    }}
                  />
                </label>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={editForm.order}
                  onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-[11px] text-muted-foreground">Lower number = shown first</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-[11px] text-muted-foreground">Inactive cards are hidden from the gallery</p>
                </div>
                <Switch
                  checked={editForm.active}
                  onCheckedChange={(v) => setEditForm({ ...editForm, active: v })}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingCard(null);
                setIsNew(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveCard}
              disabled={saving || !editForm.title || !editForm.image}
              className="gap-2 bg-gradient-to-r from-rose-500 to-violet-500 text-white hover:from-rose-600 hover:to-violet-600"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Quick Image Upload Dialog ── */}
      <Dialog open={!!uploadCardId} onOpenChange={(open) => !open && setUploadCardId(null)}>
        <DialogContent className="sm:max-w-md border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Change Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editForm.image && (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                <Image src={editForm.image} alt="Current" fill className="object-cover" />
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-rose-500/30 hover:bg-rose-500/5">
              <Upload className={`h-6 w-6 text-muted-foreground ${uploading ? "animate-pulse" : ""}`} />
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Click to select new image"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && uploadCardId) {
                    const url = await handleUpload(file, uploadCardId);
                    if (url) {
                      setEditForm((prev) => ({ ...prev, image: url }));
                      setUploadCardId(null);
                    }
                  }
                }}
              />
            </label>
            <p className="text-center text-[11px] text-muted-foreground">
              JPG, PNG, WebP, GIF — max 5MB
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-white/10 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTarget?.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The card will be permanently deleted from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCard} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Sticky Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
          <p className="text-[11px] text-muted-foreground/50">
            VaultStream Admin &bull; {cards.length} cards &bull; {cards.filter((c) => c.active).length} active
          </p>
        </div>
      </footer>
    </div>
  );
}
