"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings, uploadImage } from "@/lib/firebase";

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "";
}

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const settings = await getSiteSettings();
      if (settings?.logo_url) {
        setLogoUrl(settings.logo_url);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
      setSuccess("Logo yüklendi. Kaydetmek için 'Kaydet' butonuna tıklayın.");
    } catch (err) {
      setError("Logo yüklenemedi. Lütfen tekrar deneyin.");
      setPreviewUrl(null);
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!logoUrl) {
      setError("Lütfen önce bir logo yükleyin.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateSiteSettings({ logo_url: logoUrl });
      setSuccess("Ayarlar başarıyla kaydedildi!");
      setPreviewUrl(null);
    } catch (err) {
      setError("Ayarlar kaydedilemedi. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Site Ayarları</h1>
        <p className="text-gray-600 mt-1">Logo ve genel site ayarlarını yönetin</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Logo Yönetimi</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mevcut Logo
              </label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                  {(isValidImageUrl(previewUrl) || isValidImageUrl(logoUrl)) ? (
                    <img
                      src={previewUrl || logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Logo yok</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                        Yükleniyor...
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm">Yeni logo yüklemek için tıklayın</span>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP - Max 2MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {logoUrl && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Logo URL:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {logoUrl}
                </code>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving || !logoUrl}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
