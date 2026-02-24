import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account, storage, databases } from "../../lib/appwrite";
import { Button } from "../..//components/ui/button";
import { Loader2, UploadCloud, Download } from "lucide-react";
import { cn } from "../../lib/utils";
import { saveAs } from "file-saver";
import * as docx from "docx";
import { Packer, Paragraph } from "docx";
import { ID, type UploadProgress, Query } from "appwrite";
import Tesseract from "tesseract.js";
import { checkSubscription } from "../../utils/subscription";
import dayjs from "dayjs";
import jsPDF from "jspdf";

export default function AppPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState("");

  const [isSubscriber, setIsSubscriber] = useState(false);

  const buckedId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

  // Protect route
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await account.get();

        if (!u.prefs?.role) {
          await account.updatePrefs({
            role: "free",
            subscriptionExpiry: null,
          });
        }
        setUser(u);

        const isActive =
          u.prefs?.role === "subscriber" &&
          new Date(u.prefs.subscriptionExpiry) > new Date();
        setIsSubscriber(isActive);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // navigate("/auth");
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setOcrText("");

    try {
      const user = await account.get();
      const { isActiveSubscriber } = await checkSubscription();

      if (!isActiveSubscriber) {
        const todayStart = dayjs().startOf("day").toISOString();

        const todayUploads = await databases.listDocuments(
          databaseId,
          "uploads",
          [
            Query.equal("userId", user.$id),
            Query.greaterThanEqual("createdAt", todayStart),
          ],
        );

        if (todayUploads.total >= 2) {
          alert("Free daily limit reached. Upgrade to subscriber.");
          navigate("/pricing");
          setLoading(false);
          return;
        }
      }

      const upload = await storage.createFile(buckedId, ID.unique(), file);

      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setOcrText(data.text);

      await databases.createDocument(databaseId, "uploads", ID.unique(), {
        userId: user.$id,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      alert("Upload or OCR failed");
    } finally {
      setLoading(false);
    }
  };

  //console.log("User:", user);

  const handleDownload = async (type: "txt" | "pdf" | "docx") => {
    if (!ocrText) return;

    if (type === "txt") {
      const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "ocr_result.txt");
    } else if (type === "pdf") {
      // ✅ Using jsPDF to create a proper PDF
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(ocrText, 180); // wrap text
      doc.text(lines, 10, 10);
      doc.save("ocr_result.pdf");
    } else if (type === "docx") {
      // ✅ Proper DOCX with docx package
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      navigate("/auth");
    } catch {
      alert("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen  from-indigo-50 to-blue-50 p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-800">Smart Scanner</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          {user?.prefs?.role === "free" && (
            <Button
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="bg-blue-600 text-white"
            >
              Upgrade
            </Button>
          )}
        </div>
      </header>

      {/* Upload Area */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 mt-20">
        <div className="w-full border-2 border-dashed border-indigo-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-500 transition cursor-pointer relative">
          {!preview && (
            <>
              <UploadCloud className="h-12 w-12 text-indigo-400 mb-4" />
              <p className="text-indigo-700 text-center">
                Drag & drop an image here, or click to select a file
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
              />
            </>
          )}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="max-h-64 object-contain rounded-xl shadow-lg"
            />
          )}
        </div>

        {/* Upload Button + Progress */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button
            onClick={handleUpload}
            className={cn("flex items-center gap-2 w-full sm:w-auto")}
            disabled={!file || loading}
          >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            <UploadCloud className="h-4 w-4" />
            {loading ? "Uploading..." : "Upload & OCR"}
          </Button>

          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 sm:mt-0">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* OCR Result */}
        {ocrText && (
          <div className="w-full p-4 bg-white border rounded-xl shadow-sm text-gray-700 flex flex-col gap-4">
            <h2 className="font-semibold mb-2 text-lg text-indigo-800">
              OCR Result:
            </h2>
            <p className="whitespace-pre-wrap">{ocrText}</p>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button onClick={() => handleDownload("txt")}>
                Download TXT
              </Button>
              <Button onClick={() => handleDownload("pdf")}>
                Download PDF
              </Button>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500 text-center">
          Upload screenshots or images of text. The OCR result will appear
          above. Free users have 1 uploads/day.
        </p>
      </div>
    </div>
  );
}
