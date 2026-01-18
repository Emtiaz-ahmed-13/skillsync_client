"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface AnalysisResult {
    similarityPercentage: number;
    similarFeatures: string[];
    differentFeatures: string[];
    recommendation: string;
    estimatedComplexity: "low" | "medium" | "high";
    estimatedDuration?: string;
    suggestedTechnologies?: string[];
}

export function PDFAnalyzer() {
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];

            // Validate file type
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload a PDF file");
                return;
            }

            // Validate file size (10MB max)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File size must be less than 10MB");
                return;
            }

            setFile(selectedFile);
            setError(null);
            setResult(null);
        }
    };

    const analyzePDF = async () => {
        if (!file || !session) return;

        setAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-pdf`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Analysis failed");
            }

            setResult(data.data);
        } catch (err: any) {
            setError(err.message || "Failed to analyze PDF");
        } finally {
            setAnalyzing(false);
        }
    };

    const getComplexityColor = (complexity: string) => {
        switch (complexity) {
            case "low":
                return "text-green-600";
            case "medium":
                return "text-yellow-600";
            case "high":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">AI Project Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                        Upload your project proposal PDF and let AI analyze it
                    </p>
                </div>

                {/* Upload Section */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-upload"
                        disabled={analyzing}
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                            {file ? "Change PDF" : "Upload Project Proposal PDF"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Maximum file size: 10MB
                        </p>
                        {file && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                        )}
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Analyze Button */}
                <Button
                    onClick={analyzePDF}
                    disabled={!file || analyzing}
                    className="w-full"
                    size="lg"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing with AI...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Analyze with Gemini AI
                        </>
                    )}
                </Button>

                {/* Results Section */}
                {result && (
                    <div className="mt-6 space-y-4 animate-in fade-in duration-500">
                        {/* Similarity Score */}
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                Similarity Score
                            </h4>
                            <p className="text-5xl font-bold text-primary">
                                {result.similarityPercentage}%
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Compared with existing projects
                            </p>
                        </div>

                        {/* Complexity & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted rounded-lg p-4">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                    Complexity
                                </h4>
                                <p className={`text-lg font-bold capitalize ${getComplexityColor(result.estimatedComplexity)}`}>
                                    {result.estimatedComplexity}
                                </p>
                            </div>
                            {result.estimatedDuration && (
                                <div className="bg-muted rounded-lg p-4">
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                        Duration
                                    </h4>
                                    <p className="text-lg font-bold">
                                        {result.estimatedDuration}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Similar Features */}
                        {result.similarFeatures.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    Similar Features
                                </h4>
                                <ul className="space-y-2">
                                    {result.similarFeatures.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="text-sm bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-md"
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Unique Features */}
                        {result.differentFeatures.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Unique Features
                                </h4>
                                <ul className="space-y-2">
                                    {result.differentFeatures.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="text-sm bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md text-green-700 dark:text-green-300"
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suggested Technologies */}
                        {result.suggestedTechnologies && result.suggestedTechnologies.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3">Suggested Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.suggestedTechnologies.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Recommendation */}
                        <div className="bg-muted rounded-lg p-4">
                            <h4 className="font-semibold mb-2">AI Recommendation</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {result.recommendation}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
