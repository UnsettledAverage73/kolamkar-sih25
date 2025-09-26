"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { KolamCanvas } from "@/components/kolam-canvas"

export function GenerateWithInputs() {
  const [parameters, setParameters] = useState({
    gridType: "square",
    rows: 8,
    columns: 8,
    dotSpacing: 20,
    strokeType: "continuous",
    symmetryType: "4-fold",
    iterations: 1,
    rhombus_size: 5, // Initialize rhombus_size
    grid_size: 8, // Initialize grid_size
    polygon1_sides: 6, // Initialize polygon1_sides
    polygon1_radius: 3, // Initialize polygon1_radius
    polygon2_sides: 8, // Initialize polygon2_sides
    polygon2_radius: 2, // Initialize polygon2_radius
  })
  const [designType, setDesignType] = useState("lsystem")
  const [kolamSvg, setKolamSvg] = useState<string | null>(null) // Changed from kolamImageBase64
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleParameterChange = (key: string, value: any) => {
    setParameters((prev) => ({ ...prev, [key]: value }))
  }

  const generateKolam = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8000/generate-kolam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...parameters, design_type: designType }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`)
      }

      const svgData = await response.text() 
      setKolamSvg(svgData)

    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Optionally generate a kolam on initial load
    // generateKolam();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Design Parameters</CardTitle>
          <CardDescription>Adjust the settings below to customize your Kolam design</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Design Type */}
          <div className="space-y-2">
            <Label htmlFor="design-type">Design Type</Label>
            <Select value={designType} onValueChange={(value) => setDesignType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select design type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lsystem">L-System Kolam</SelectItem>
                <SelectItem value="suzhi">Suzhi Kolam</SelectItem>
                <SelectItem value="kambi">Kambi Kolam</SelectItem>
                <SelectItem value="grouptheory">Group Theory Kolam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {designType === "kambi" && (
            <div className="space-y-2">
              <Label htmlFor="rhombus-size">Rhombus Size</Label>
              <Input
                id="rhombus-size"
                type="number"
                min="1"
                max="10"
                value={parameters.rhombus_size}
                onChange={(e) => handleParameterChange("rhombus_size", Number.parseInt(e.target.value))}
              />
            </div>
          )}

          {designType === "grouptheory" && (
            <div className="space-y-4">
              <h4 className="font-medium text-card-foreground mt-4">Group Theory Parameters</h4>
              <div className="space-y-2">
                <Label htmlFor="grid-size">Grid Size</Label>
                <Input
                  id="grid-size"
                  type="number"
                  min="1"
                  max="20"
                  value={parameters.grid_size}
                  onChange={(e) => handleParameterChange("grid_size", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="polygon1-sides">Polygon 1 Sides</Label>
                <Input
                  id="polygon1-sides"
                  type="number"
                  min="3"
                  max="10"
                  value={parameters.polygon1_sides}
                  onChange={(e) => handleParameterChange("polygon1_sides", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="polygon1-radius">Polygon 1 Radius</Label>
                <Input
                  id="polygon1-radius"
                  type="number"
                  min="1"
                  max="10"
                  value={parameters.polygon1_radius}
                  onChange={(e) => handleParameterChange("polygon1_radius", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="polygon2-sides">Polygon 2 Sides</Label>
                <Input
                  id="polygon2-sides"
                  type="number"
                  min="3"
                  max="10"
                  value={parameters.polygon2_sides}
                  onChange={(e) => handleParameterChange("polygon2_sides", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="polygon2-radius">Polygon 2 Radius</Label>
                <Input
                  id="polygon2-radius"
                  type="number"
                  min="1"
                  max="10"
                  value={parameters.polygon2_radius}
                  onChange={(e) => handleParameterChange("polygon2_radius", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Grid Type */}
          <div className="space-y-2">
            <Label htmlFor="grid-type">Grid Type</Label>
            <Select value={parameters.gridType} onValueChange={(value) => handleParameterChange("gridType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grid type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square Grid</SelectItem>
                <SelectItem value="triangular">Triangular Grid</SelectItem>
                <SelectItem value="hexagonal">Hexagonal Grid</SelectItem>
                <SelectItem value="circular">Circular Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rows and Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="3"
                max="20"
                value={parameters.rows}
                onChange={(e) => handleParameterChange("rows", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                min="3"
                max="20"
                value={parameters.columns}
                onChange={(e) => handleParameterChange("columns", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Dot Spacing */}
          <div className="space-y-2">
            <Label>Dot Spacing: {parameters.dotSpacing}px</Label>
            <Slider
              value={[parameters.dotSpacing]}
              onValueChange={(value) => handleParameterChange("dotSpacing", value[0])}
              max={50}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          {/* Stroke Type */}
          <div className="space-y-2">
            <Label htmlFor="stroke-type">Stroke Type</Label>
            <Select value={parameters.strokeType} onValueChange={(value) => handleParameterChange("strokeType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stroke type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="continuous">Continuous Line</SelectItem>
                <SelectItem value="dashed">Dashed Line</SelectItem>
                <SelectItem value="dotted">Dotted Line</SelectItem>
                <SelectItem value="thick">Thick Line</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Symmetry Type */}
          <div className="space-y-2">
            <Label htmlFor="symmetry-type">Symmetry Type</Label>
            <Select
              value={parameters.symmetryType}
              onValueChange={(value) => handleParameterChange("symmetryType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select symmetry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-fold">2-fold Rotational</SelectItem>
                <SelectItem value="4-fold">4-fold Rotational</SelectItem>
                <SelectItem value="6-fold">6-fold Rotational</SelectItem>
                <SelectItem value="8-fold">8-fold Rotational</SelectItem>
                <SelectItem value="radial">Radial Symmetry</SelectItem>
                <SelectItem value="bilateral">Bilateral Symmetry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Iterations */}
          <div className="space-y-2">
            <Label>Iterations: {parameters.iterations}</Label>
            <Slider
              value={[parameters.iterations]}
              onValueChange={(value) => handleParameterChange("iterations", value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <Button onClick={generateKolam} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Kolam"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
        </CardContent>
      </Card>

      {/* Canvas Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Generated Design</CardTitle>
          <CardDescription>Your Kolam pattern will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <KolamCanvas parameters={parameters} kolamSvg={kolamSvg} />

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="flex-1 sm:flex-none">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Save as SVG
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Save as PNG
            </Button>
            <Button variant="secondary" className="flex-1 sm:flex-none">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analyze This
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
