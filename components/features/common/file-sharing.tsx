"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, File, Upload, X } from "lucide-react";
import { useState } from "react";

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url: string;
}

export default function FileSharing({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "design-mockups.pdf",
      size: "2.4 MB",
      type: "pdf",
      uploadedAt: "2025-01-10",
      url: "#",
    },
    {
      id: "2",
      name: "requirements.docx",
      size: "1.1 MB",
      type: "docx",
      uploadedAt: "2025-01-08",
      url: "#",
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: selectedFile.name,
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      type: selectedFile.name.split(".").pop() || "file",
      uploadedAt: new Date().toISOString().split("T")[0],
      url: "#",
    };

    setFiles([newFile, ...files]);
    setSelectedFile(null);

    // Reset the file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <File className="w-6 h-6 text-primary" />
            Project Files
          </h3>
          <p className="text-muted-foreground">
            Share and manage project assets
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download All
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-lg font-semibold">Upload your files</h4>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            Drag and drop your files here, or click to browse. Supports PDF,
            DOCX, JPG, PNG (Max 10MB)
          </p>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                variant="secondary"
              >
                Browse Files
              </Button>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 bg-background border px-3 py-1.5 rounded-md text-sm">
                <span className="truncate max-w-[150px] font-medium">
                  {selectedFile.name}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {selectedFile && <Button onClick={handleUpload}>Upload</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div>
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          Uploaded Files <Badge variant="secondary">{files.length}</Badge>
        </h4>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Card
                key={file.id}
                className="group hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      file.type === "pdf"
                        ? "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"
                        : file.type === "docx"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400"
                        : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <File className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium truncate" title={file.name}>
                      {file.name}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="uppercase">{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Uploaded on{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => window.open(file.url)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
