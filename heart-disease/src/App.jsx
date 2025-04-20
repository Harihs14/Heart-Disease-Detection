import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
      setPrediction(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select an image first')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to process image')
      }
      
      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err.message || 'An error occurred during prediction')
    } finally {
      setLoading(false)
    }
  }
  
  const getColor = (className) => {
    switch (className) {
      case 'Normal':
        return '#10b981' // green
      case 'MI':
      case 'Abnormal':
      case 'HMI':
        return '#ef4444' // red
      default:
        return '#6366f1' // indigo
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top header with logo and title */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">HeartScan AI</h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100">
            YOLOv8 Model
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Upload panel - 2 columns */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Upload card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-800">Upload Cardiac Image</h2>
                <p className="text-sm text-slate-500 mt-1">Select or drag and drop a heart scan image</p>
              </div>
              
              <div className="px-6 pb-6">
                <label 
                  htmlFor="image-upload"
                  className={`group relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                    ${preview ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                >
                  {preview ? (
                    <div className="w-full">
                      <img 
                        src={preview} 
                        alt="Image preview" 
                        className="max-h-52 mx-auto rounded-lg object-contain ring-1 ring-slate-200"
                      />
                      <p className="text-xs text-slate-500 text-center mt-3">Click to change image</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-slate-300 mb-3 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-slate-800">Click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG or JPEG</p>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !file}
                  className={`mt-6 w-full py-3 px-5 rounded-lg font-medium text-white transition-all flex items-center justify-center
                    ${loading || !file 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md hover:from-indigo-500 hover:to-purple-500'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </button>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Heart Visualization Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Heart Health Visualizer</h2>
                <p className="text-sm text-slate-500 mt-1">Understanding cardiac conditions</p>
              </div>
              
              <div className="p-6 relative flex justify-center">
                {/* Stylized heart visualization */}
                <div className="relative w-48 h-48">
                  {/* Heart animation */}
                  <div className="absolute inset-0 w-full h-full">
                    <div className={`w-full h-full ${prediction ? '' : 'animate-pulse'}`} style={{ 
                      backgroundColor: prediction ? getColor(prediction.class) + '20' : '#6366f120',
                      borderRadius: '50%'
                    }}></div>
                  </div>
                  
                  {/* Beating heart SVG */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className={`w-32 h-32 ${prediction ? '' : 'animate-pulse'}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={prediction ? getColor(prediction.class) : '#6366f1'} 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  
                  {/* ECG Line */}
                  <div className="absolute bottom-0 left-0 w-full">
                    <svg 
                      className="w-full h-12" 
                      viewBox="0 0 100 20" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,10 L10,10 C12,10 13,0 15,0 C17,0 18,10 20,10 L30,10 C32,10 33,5 35,5 C37,5 38,10 40,10 L50,10 C55,10 55,15 60,15 C65,15 65,5 70,5 C75,5 75,10 80,10 L100,10" 
                        fill="none" 
                        stroke={prediction ? getColor(prediction.class) : '#6366f1'} 
                        strokeWidth="1"
                        className={prediction ? '' : 'animate-pulse'}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Condition indicators */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg text-center ${prediction && prediction.class === 'Normal' ? 'bg-green-50 ring-1 ring-green-100' : 'bg-slate-50'}`}>
                    <span className="text-xs font-medium uppercase" style={{ color: getColor('Normal') }}>Normal</span>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${prediction && prediction.class === 'MI' ? 'bg-red-50 ring-1 ring-red-100' : 'bg-slate-50'}`}>
                    <span className="text-xs font-medium uppercase" style={{ color: getColor('MI') }}>MI</span>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${prediction && prediction.class === 'HMI' ? 'bg-red-50 ring-1 ring-red-100' : 'bg-slate-50'}`}>
                    <span className="text-xs font-medium uppercase" style={{ color: getColor('HMI') }}>HMI</span>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${prediction && prediction.class === 'Abnormal' ? 'bg-red-50 ring-1 ring-red-100' : 'bg-slate-50'}`}>
                    <span className="text-xs font-medium uppercase" style={{ color: getColor('Abnormal') }}>Abnormal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results panel - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main results card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Analysis Results</h2>
                <p className="text-sm text-slate-500 mt-1">Cardiac condition detection</p>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 animate-pulse">Analyzing cardiac image...</p>
                  </div>
                ) : prediction ? (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center mb-3 px-4 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600">
                          Diagnosis
                        </div>
                        <div className="flex items-center justify-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: getColor(prediction.class) }}
                          ></div>
                          <h3 className="text-3xl font-bold" style={{ color: getColor(prediction.class) }}>
                            {prediction.class}
                          </h3>
                        </div>
                        <p className="text-slate-500 mt-2">
                          Confidence: <span className="font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider">Probability Distribution</h3>
                      {Object.entries(prediction.predictions)
                        .sort((a, b) => b[1] - a[1]) // Sort by confidence, highest first
                        .map(([className, confidence]) => (
                          <div key={className}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <div 
                                  className="w-2 h-2 rounded-full mr-2" 
                                  style={{ backgroundColor: getColor(className) }}
                                ></div>
                                <span className="text-sm font-medium text-slate-700">{className}</span>
                              </div>
                              <span className="text-sm font-medium text-slate-900">{(confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{ 
                                  width: `${confidence * 100}%`,
                                  backgroundColor: getColor(className),
                                  opacity: className === prediction.class ? 1 : 0.4
                                }}
                              ></div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-center">Upload a cardiac image to get analysis results</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Condition information card */}
            {prediction && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-800">Condition Information</h2>
                  <p className="text-sm text-slate-500 mt-1">Understanding the diagnosis</p>
                </div>
                
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="font-medium text-green-800">Normal</h3>
                      </div>
                      <p className="text-sm text-green-700">No signs of cardiac abnormalities detected in the heart scan image.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <h3 className="font-medium text-red-800">MI</h3>
                      </div>
                      <p className="text-sm text-red-700">Myocardial Infarction (heart attack) with damaged heart muscle tissue.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <h3 className="font-medium text-red-800">HMI</h3>
                      </div>
                      <p className="text-sm text-red-700">Hypertrophic Myocardial Infarction with thickened heart wall.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <h3 className="font-medium text-red-800">Abnormal</h3>
                      </div>
                      <p className="text-sm text-red-700">Other cardiac abnormalities detected that require medical attention.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-slate-500 text-sm">HeartScan AI</span>
            </div>
            
            <div className="text-slate-400 text-sm">
              Powered by YOLOv8, FastAPI & React • © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App