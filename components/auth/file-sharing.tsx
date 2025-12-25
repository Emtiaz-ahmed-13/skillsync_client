"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card>
      <CardHeader>
        <CardTitle>File Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Upload File
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button onClick={handleUpload} disabled={!selectedFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Files</h3>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No files uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} • {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
