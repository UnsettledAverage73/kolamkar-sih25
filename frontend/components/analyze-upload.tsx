"use client"

import { useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AnalysisResult {
  symmetryType: string
  rotationPatterns: string[]
  gridSystem: string
  complexity: string
  specifications: {
    dimensions: string
    dotCount: number
    lineLength: string
    strokeWidth: string
  }
  algorithm: string[]
  culturalSignificance: string
}

export function AnalyzeUpload() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisResult(null)
    setError(null)

    if (!uploadedImage) {
      setError("Please upload an image first.")
      setIsAnalyzing(false)
      return
    }

    // Simulate analysis progress
    const progressSteps = [
      { step: 20, message: "Detecting patterns..." },
      { step: 40, message: "Analyzing symmetry..." },
      { step: 60, message: "Calculating dimensions..." },
      { step: 80, message: "Identifying cultural elements..." },
      { step: 100, message: "Generating report..." },
    ]

    for (const { step } of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 300)) // Reduced timeout for quicker simulation
      setAnalysisProgress(step)
    }

    try {
      const response = await fetch("https://kolamkar-s-1.onrender.com/analyze-kolam-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: uploadedImage }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`)
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)

    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Upload Kolam Image</CardTitle>
          <CardDescription>Upload a clear image of your Kolam design for detailed analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded Kolam"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                />
                <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-4">
                <svg
                  className="mx-auto h-12 w-12 text-muted-foreground"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80">
                      Click to upload
                    </label>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {/* Analyze Button */}
          {uploadedImage && (
            <Button onClick={analyzeImage} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Design...
                </>
              ) : (
                "Analyze Kolam Design"
              )}
            </Button>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{analysisProgress}% complete</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

          {/* Upload Tips */}
          <div className="bg-card rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-2">Tips for accurate analysis:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use high-resolution images (minimum 500x500px)</li>
              <li>• Ensure good lighting and contrast</li>
              <li>• Center the Kolam in the frame</li>
              <li>• Avoid shadows or reflections</li>
              <li>• Clean, complete patterns work best</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Analysis Results</CardTitle>
          <CardDescription>Detailed mathematical and cultural analysis of your Kolam design</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult ? (
            <div className="space-y-6">
              {/* Symmetry Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Symmetry Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{analysisResult.symmetryType}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground mb-2 block">Rotation Patterns:</span>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.rotationPatterns.map((pattern, index) => (
                        <Badge key={index} variant="outline">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid System */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Grid System</h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Structure:</span>
                  <Badge>{analysisResult.gridSystem}</Badge>
                </div>
              </div>

              {/* Complexity */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Complexity Level</h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <Badge variant={analysisResult.complexity === "Advanced" ? "destructive" : "default"}>
                    {analysisResult.complexity}
                  </Badge>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Technical Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(analysisResult.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithm */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Construction Algorithm</h3>
                <div className="space-y-2">
                  {analysisResult.algorithm.map((step, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Significance */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">Cultural Significance</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{analysisResult.culturalSignificance}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button className="flex-1 sm:flex-none">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share Analysis
                </Button>
                <Button variant="secondary" className="flex-1 sm:flex-none">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Recreate Design
                </Button>
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p>Upload a Kolam image to see detailed analysis</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
