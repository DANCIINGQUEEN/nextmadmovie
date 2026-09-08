"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatDate } from "./DateCard";
export function getVideoId(link) {
  try {
    const url = new URL(link);
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname)) return null;
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    return /^[\w-]{11}$/.test(id ?? "") ? id : null;
  } catch {
    return null;
  }
}
export function CenteredDialog({
  open,
  onClose,
  title,
  children,
  className = ""
}) {
  return <Dialog.Root open={open} onOpenChange={value => !value && onClose()}><Dialog.Portal><Dialog.Overlay className="modal-backdrop" /><Dialog.Content className={`modal-panel ${className}`} aria-describedby={undefined}><Dialog.Title className="modal-title">{title}</Dialog.Title><Dialog.Close className="icon-button modal-close" aria-label="닫기"><X size={20} /></Dialog.Close>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
export default function VideoModal({
  video,
  onClose
}) {
  const id = video ? getVideoId(video.link) : null;
  return <CenteredDialog open={!!video} onClose={onClose} title={video?.title} className="video-modal">{video && <><p className="modal-meta">{formatDate(video.date)}<span>·</span>League of Legends</p>{id ? <iframe className="video-frame" src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <p className="video-unavailable">영상을 재생할 수 없는 링크입니다.</p>}</>}</CenteredDialog>;
}

