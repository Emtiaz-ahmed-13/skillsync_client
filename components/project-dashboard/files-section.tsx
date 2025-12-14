import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Upload } from "lucide-react";
import { useState } from "react";
import { FileUploadModal } from "./file-upload-modal";

interface FileData {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  owner: string;
}

const mockFiles: FileData[] = [
  {
    id: "1",
    name: "Project_Brief.pdf",
    size: "2.4 MB",
    type: "pdf",
    uploadedAt: "2 hours ago",
    owner: "Alex Morgan",
  },
  {
    id: "2",
    name: "Wireframes.fig",
    size: "15.7 MB",
    type: "fig",
    uploadedAt: "1 day ago",
    owner: "Jamie Smith",
  },
  {
    id: "3",
    name: "Style_Guide.docx",
    size: "1.2 MB",
    type: "docx",
    uploadedAt: "3 days ago",
    owner: "Taylor Kim",
  },
  {
    id: "4",
    name: "Logo_Assets.zip",
    size: "8.3 MB",
    type: "zip",
    uploadedAt: "1 week ago",
    owner: "Casey Brown",
  },
];

export function FilesSection() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "fig":
        return <FileText className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFileTypeBg = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "bg-red-100";
      case "docx":
      case "doc":
        return "bg-blue-100";
      case "fig":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleFileUpload = (file: File) => {
    // In a real app, this would upload the file to a server
    console.log("Uploading file:", file.name);
    // For demo purposes, we'll just show a success message
    alert(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <>
      <Card className="border-gray-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-primary-heading">Files</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skillsync-cyan focus:border-skillsync-cyan"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-body hover:bg-gray-100"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeBg(
                      file.type
                    )}`}
                  >
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-heading">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-body">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>Uploaded {file.uploadedAt}</span>
                      <span>•</span>
                      <span>by {file.owner}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </>
  );
}
