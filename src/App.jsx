
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import './App.css'

function App() {
const defaultFormData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  currentWebsite: '',
  industry: '',
  goals: [],
  websiteType: '',
  pages: [],
  features: [],
  hasLogo: '',
  hasBrandColours: '',
  hasContent: '',
  hasImages: '',
  exampleWebsites: '',
  designNotes: '',
  budget: '',
  launchDate: '',
  flexibleDeadline: '',
  importantDates: '',
}
  const [formData, setFormData] = useState(defaultFormData)

  const [showSummary, setShowSummary] = useState(false)

  const [briefs, setBriefs] = useState([])

const [editingId, setEditingId] = useState(null)

const [errors, setErrors] = useState({})

const [currentStep, setCurrentStep] = useState(1)

const totalSteps = 7

useEffect(() => {
  const savedBriefs = localStorage.getItem('qbsBriefs')

  if (savedBriefs) {
    setBriefs(JSON.parse(savedBriefs))
  }
}, [])


const handleChange = (e) => {
  const { name, value } = e.target

  setFormData({
    ...formData,
    [name]: value
  })

  setErrors({
    ...errors,
    [name]: ''
  })
}

const handleCheckboxChange = (e, fieldName) => {
  const { value, checked } = e.target

  if (checked) {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], value]
    })
  } else {
    setFormData({
      ...formData,
      [fieldName]: formData[fieldName].filter((item) => item !== value)
    })
  }

  setErrors({
    ...errors,
    [fieldName]: ''
  })
}

const validateForm = () => {
  const newErrors = {}

  const nameRegex = /^[A-Za-z\s'-]{2,}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/
  const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
  const budgetRegex = /^R?\s?\d+(\s?-\s?R?\s?\d+)?$/

  if (!formData.companyName.trim()) {
    newErrors.companyName = 'Company name is required.'
  }

  if (!nameRegex.test(formData.contactPerson.trim())) {
    newErrors.contactPerson = 'Enter a valid contact person name.'
  }

  if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = 'Enter a valid email address.'
  }

  if (!phoneRegex.test(formData.phone.trim())) {
    newErrors.phone = 'Enter a valid South African phone number, e.g. 0712345678 or +27712345678.'
  }

  if (
    formData.currentWebsite.trim() &&
    !websiteRegex.test(formData.currentWebsite.trim())
  ) {
    newErrors.currentWebsite = 'Enter a valid website, e.g. https://example.com.'
  }

  if (!formData.industry.trim()) {
    newErrors.industry = 'Industry or business type is required.'
  }

  if (formData.goals.length === 0) {
    newErrors.goals = 'Select at least one website goal.'
  }

  if (!formData.websiteType) {
    newErrors.websiteType = 'Select a website type.'
  }

  if (formData.pages.length === 0) {
    newErrors.pages = 'Select at least one required page.'
  }

  if (formData.features.length === 0) {
    newErrors.features = 'Select at least one required feature.'
  }

  if (!formData.hasLogo) {
    newErrors.hasLogo = 'Select whether the client has a logo.'
  }

  if (!formData.hasBrandColours) {
    newErrors.hasBrandColours = 'Select whether the client has brand colours.'
  }

  if (!formData.hasContent) {
    newErrors.hasContent = 'Select whether the client has existing content.'
  }

  if (!formData.hasImages) {
    newErrors.hasImages = 'Select whether the client has images.'
  }

  if (!budgetRegex.test(formData.budget.trim())) {
    newErrors.budget = 'Enter a valid budget, e.g. R5000 or R5000 - R10000.'
  }

  if (!formData.launchDate) {
    newErrors.launchDate = 'Select a launch date.'
  }

  if (!formData.flexibleDeadline) {
    newErrors.flexibleDeadline = 'Select whether the deadline is flexible.'
  }

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0
}

const handleSubmit = (e) => {
  e.preventDefault()

  if (validateForm()) {
    setShowSummary(true)
  } else {
    alert('Please go back to the previous fields and correct the information that does not meet the required format.')
    window.scrollTo(0, 0)
  }
}
const nextStep = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }
}

const previousStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }
}
const saveBrief = () => {
  let updatedBriefs

  if (editingId) {
    updatedBriefs = briefs.map((brief) =>
      brief.id === editingId
        ? { ...formData, id: editingId }
        : brief
    )
  } else {
    const newBrief = {
      ...formData,
      id: Date.now()
    }

    updatedBriefs = [...briefs, newBrief]
  }

  setBriefs(updatedBriefs)
  localStorage.setItem('qbsBriefs', JSON.stringify(updatedBriefs))

  setFormData(defaultFormData)
  setEditingId(null)
  setShowSummary(false)

  alert('Brief saved successfully!')
}

const editBrief = (brief) => {
  setFormData({
    ...defaultFormData,
    ...brief,
    goals: brief.goals || [],
    pages: brief.pages || [],
    features: brief.features || []
  })

  setEditingId(brief.id)
  setShowSummary(false)

  window.scrollTo(0, 0)
}

const deleteBrief = (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this brief?'
  )

  if (!confirmDelete) {
    return
  }

  const updatedBriefs = briefs.filter((brief) => brief.id !== id)

  setBriefs(updatedBriefs)
  localStorage.setItem('qbsBriefs', JSON.stringify(updatedBriefs))
}

const exportBriefAsJSON = (brief) => {
  const jsonData = JSON.stringify(brief, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${brief.companyName || 'client-brief'}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
const exportBriefAsPDF = () => {
  const doc = new jsPDF()

  let y = 15

  doc.setFontSize(16)
  doc.text('QBS Client Website Brief', 10, y)

  y += 12

  doc.setFontSize(12)

  const addSection = (title, lines) => {
    doc.setFontSize(14)
    doc.text(title, 10, y)
    y += 8

    doc.setFontSize(11)

    lines.forEach((line) => {
      const splitText = doc.splitTextToSize(line, 180)

      splitText.forEach((textLine) => {
        if (y > 280) {
          doc.addPage()
          y = 15
        }

        doc.text(textLine, 10, y)
        y += 7
      })
    })

    y += 5
  }

  addSection('Generated Brief Summary', [
    generateBriefSummary()
  ])

  addSection('Client Details', [
    `Company Name: ${formData.companyName}`,
    `Contact Person: ${formData.contactPerson}`,
    `Email: ${formData.email}`,
    `Phone: ${formData.phone}`,
    `Current Website: ${formData.currentWebsite}`,
    `Industry: ${formData.industry}`
  ])

  addSection('Website Goals', [
    formData.goals.join(', ') || 'None selected'
  ])

  addSection('Website Type', [
    formData.websiteType || 'Not selected'
  ])

  addSection('Required Pages', [
    formData.pages.join(', ') || 'None selected'
  ])

  addSection('Required Features', [
    formData.features.join(', ') || 'None selected'
  ])

  addSection('Design and Branding', [
    `Has Logo: ${formData.hasLogo}`,
    `Has Brand Colours: ${formData.hasBrandColours}`,
    `Has Content: ${formData.hasContent}`,
    `Has Images: ${formData.hasImages}`,
    `Example Websites: ${formData.exampleWebsites}`,
    `Design Notes: ${formData.designNotes}`
  ])

  addSection('Budget and Timeline', [
    `Budget: ${formData.budget}`,
    `Launch Date: ${formData.launchDate}`,
    `Flexible Deadline: ${formData.flexibleDeadline}`,
    `Important Dates: ${formData.importantDates}`
  ])

  doc.save(`${formData.companyName || 'client-brief'}.pdf`)
}
  const generateBriefSummary = () => {
  const goals = formData.goals.length > 0
    ? formData.goals.join(', ')
    : 'no specific goals selected'

  const pages = formData.pages.length > 0
    ? formData.pages.join(', ')
    : 'no pages selected'

  const features = formData.features.length > 0
    ? formData.features.join(', ')
    : 'no features selected'

  return `${formData.companyName || 'The client'} is looking for a ${formData.websiteType || 'website'}.

The main website goals are ${goals}. The required pages include ${pages}. The requested features include ${features}.

For branding, the client logo status is "${formData.hasLogo}", brand colours status is "${formData.hasBrandColours}", content status is "${formData.hasContent}", and image availability is "${formData.hasImages}".

The estimated budget is ${formData.budget || 'not provided'}, with a desired launch date of ${formData.launchDate || 'not provided'}. The deadline flexibility is "${formData.flexibleDeadline || 'not specified'}".`
}
const copySummary = () => {
  const summaryText = `
QBS Client Website Brief

CLIENT DETAILS
Company Name: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
Current Website: ${formData.currentWebsite}
Industry: ${formData.industry}

WEBSITE GOALS
${formData.goals.join(', ')}

WEBSITE TYPE
${formData.websiteType}

REQUIRED PAGES
${formData.pages.join(', ')}

REQUIRED FEATURES
${formData.features.join(', ')}

DESIGN AND BRANDING
Has Logo: ${formData.hasLogo}
Has Brand Colours: ${formData.hasBrandColours}
Has Content: ${formData.hasContent}
Has Images: ${formData.hasImages}
Example Websites: ${formData.exampleWebsites}
Design Notes: ${formData.designNotes}

BUDGET AND TIMELINE
Budget: ${formData.budget}
Launch Date: ${formData.launchDate}
Flexible Deadline: ${formData.flexibleDeadline}
Important Dates: ${formData.importantDates}
`

  navigator.clipboard.writeText(summaryText)

  alert('Summary copied to clipboard!')
}

if (showSummary) {
  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow"> 
        <h1 className="app-title text-center mb-4">
          Brief Summary
        </h1>

        <div className="summary-section">
  <h3>Generated Brief Summary</h3>
  <p>{generateBriefSummary()}</p>
</div>

        <div className="summary-section">
          <h3>Client Details</h3>
          <p><strong>Company Name:</strong> {formData.companyName}</p>
          <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Current Website:</strong> {formData.currentWebsite}</p>
          <p><strong>Industry:</strong> {formData.industry}</p>
        </div>

        <div className="summary-section">
          <h3>Website Goals</h3>
          <p>{formData.goals.join(', ') || 'None selected'}</p>
        </div>

        <div className="summary-section">
          <h3>Website Type</h3>
          <p>{formData.websiteType || 'Not selected'}</p>
        </div>

        <div className="summary-section">
          <h3>Required Pages</h3>
          <p>{formData.pages.join(', ') || 'None selected'}</p>
        </div>

        <div className="summary-section">
          <h3>Required Features</h3>
          <p>{formData.features.join(', ') || 'None selected'}</p>
        </div>

        <div className="summary-section">
          <h3>Design and Branding</h3>
          <p><strong>Has Logo:</strong> {formData.hasLogo}</p>
          <p><strong>Has Brand Colours:</strong> {formData.hasBrandColours}</p>
          <p><strong>Has Content:</strong> {formData.hasContent}</p>
          <p><strong>Has Images:</strong> {formData.hasImages}</p>
          <p><strong>Example Websites:</strong> {formData.exampleWebsites}</p>
          <p><strong>Design Notes:</strong> {formData.designNotes}</p>
        </div>

        <div className="summary-section">
          <h3>Budget and Timeline</h3>
          <p><strong>Budget:</strong> {formData.budget}</p>
          <p><strong>Launch Date:</strong> {formData.launchDate}</p>
          <p><strong>Flexible Deadline:</strong> {formData.flexibleDeadline}</p>
          <p><strong>Important Dates:</strong> {formData.importantDates}</p>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowSummary(false)}
          >
            Edit Brief
          </button>

         <button
  type="button"
  className="btn btn-primary"
  onClick={saveBrief}
>
  {editingId ? 'Update Brief' : 'Save Brief'}
</button>

          <button
            type="button"
            className="btn btn-success"
            onClick={copySummary}
          >
            Copy Summary
          </button>
        
           <button
    type="button"
    className="btn btn-dark"
    onClick={exportBriefAsPDF}
  >
    Export PDF
  </button>

        </div>
      </div>
    </div>
  )
}
  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4">
          QBS Client Website Brief Tool
        </h1>
 

<div className="mb-4">
  <p className="fw-bold">
    Step {currentStep} of {totalSteps}
  </p>

  <div className="progress">
    <div
      className="progress-bar"
      role="progressbar"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    >
      {Math.round((currentStep / totalSteps) * 100)}%
    </div>
  </div>
</div>
 <div className="dashboard-card mb-4">
  <h3>Dashboard</h3>
  <p>Total briefs captured: {briefs.length}</p>
<button
  type="button"
  className="btn btn-success mb-3"
  onClick={() => {
    setFormData(defaultFormData)
    setEditingId(null)
    setShowSummary(false)
  }}
>
  Create New Brief
</button>

  {briefs.length === 0 ? (
    <p>No briefs saved yet.</p>
  ) : (
    <div>
      {briefs.map((brief) => (
        <div className="saved-brief-card" key={brief.id}>
          <div>
            <h5>{brief.companyName || 'Untitled Brief'}</h5>
            <p>{brief.websiteType || 'No website type selected'}</p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-warning btn-sm"
              onClick={() => editBrief(brief)}
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => deleteBrief(brief.id)}
            >
              Delete
            </button>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => exportBriefAsJSON(brief)}
            >
              Export JSON
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
       <form onSubmit={handleSubmit}>
  {currentStep === 1 && (
    <>
      <h3>Client Details</h3>

      <div className="mb-3">
        <label className="form-label">Company Name</label>
        <input
          type="text"
          name="companyName"
          className="form-control"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        {errors.companyName && (
  <small className="text-danger">{errors.companyName}</small>
)}

      </div>

      <div className="mb-3">
        <label className="form-label">Contact Person</label>
        <input
          type="text"
          name="contactPerson"
          className="form-control"
          value={formData.contactPerson}
          onChange={handleChange}
          required
        />
        {errors.contactPerson && (
  <small className="text-danger">{errors.contactPerson}</small>
)}
      </div>

      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && (
  <small className="text-danger">{errors.email}</small>
)}
      </div>

      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && (
  <small className="text-danger">{errors.phone}</small>
)}
      </div>

      <div className="mb-3">
        <label className="form-label">Current Website</label>
        <input
          type="text"
          name="currentWebsite"
          className="form-control"
          value={formData.currentWebsite}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        {errors.currentWebsite && (
  <small className="text-danger">{errors.currentWebsite}</small>
)}
      </div>

      <div className="mb-3">
        <label className="form-label">Industry / Business Type</label>
        <input
          type="text"
          name="industry"
          className="form-control"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Example: Retail, Beauty, Construction"
        />
{errors.industry && (
  <small className="text-danger">{errors.industry}</small>
)}

      </div>
    </>
  )}

         {currentStep === 2 && (
  <>
    <h3 className="mt-4">Website Goals</h3>

    <div className="goals-section">
      <label className="goals-title">
        Website goals (select all that apply)
      </label>

      {[
        'Generate leads',
        'Sell products online',
        'Showcase services',
        'Take bookings',
        'Share company information',
        'Improve credibility',
        'Other'
      ].map((goal) => (
        <label
          className={
            formData.goals.includes(goal)
              ? 'goal-card selected'
              : 'goal-card'
          }
          key={goal}
        >
          <input
            type="checkbox"
            value={goal}
            checked={formData.goals.includes(goal)}
            onChange={(e) => handleCheckboxChange(e, 'goals')}
          />
          <div className="goals-section">

  {errors.goals && (
    <small className="text-danger">{errors.goals}</small>
  )}
</div>
          <span>{goal}</span>
        </label>

      ))}
    </div>
  </>
)}
         {currentStep === 3 && (
  <>
    <h3 className="mt-4">Website Type</h3>

    <div className="mb-3">
      <label className="form-label">Select Website Type</label>
      <select
        name="websiteType"
        className="form-control"
        value={formData.websiteType}
        onChange={handleChange}
        required
      >
        <option value="">Choose one</option>
        <option value="Basic business website">Basic business website</option>
        <option value="E-commerce website">E-commerce website</option>
        <option value="Landing page">Landing page</option>
        <option value="Blog / content website">Blog / content website</option>
        <option value="Web application">Web application</option>
        <option value="Not sure">Not sure</option>
      </select>
      {errors.websiteType && (
  <small className="text-danger">{errors.websiteType}</small>
)}
    </div>
  </>
)}

{currentStep === 4 && (
  <>

<h3 className="mt-4">Required Pages</h3>

<div className="pages-section">
  <label className="pages-title">
    Required pages (select all that apply)
  </label>

  {[
    'Home',
    'About',
    'Services',
    'Products',
    'Contact',
    'Blog',
    'FAQ',
    'Testimonials',
    'Careers',
    'Privacy Policy',
    'Terms and Conditions',
    'Other'
  ].map((page) => (
    <label
      className={
        formData.pages.includes(page)
          ? 'page-card selected'
          : 'page-card'
      }
      key={page}
    >
      <input
        type="checkbox"
        value={page}
        checked={formData.pages.includes(page)}
        onChange={(e) => handleCheckboxChange(e, 'pages')}
      />

      <span>{page}</span>
    </label>
  ))}
{errors.pages && (
  <small className="text-danger">{errors.pages}</small>
)}

</div>

  </>
)}

{currentStep === 5 && (
  <>
<h3 className="mt-4">Required Features</h3>

<div className="features-section">
  <label className="features-title">
    Required features (select all that apply)
  </label>

  {[
    'Contact form',
    'Quote request form',
    'WhatsApp button',
    'Online payments',
    'Booking calendar',
    'Newsletter signup',
    'User login',
    'Admin dashboard',
    'Product catalogue',
    'E-commerce checkout',
    'SEO setup',
    'Google Analytics',
    'Other'
  ].map((feature) => (
    <label
      className={
        formData.features.includes(feature)
          ? 'feature-card selected'
          : 'feature-card'
      }
      key={feature}
    >
      <input
        type="checkbox"
        value={feature}
        checked={formData.features.includes(feature)}
        onChange={(e) => handleCheckboxChange(e, 'features')}
      />

      <span>{feature}</span>
    </label>
  ))}
  {errors.features && (
  <small className="text-danger">{errors.features}</small>
)}
</div>
  </>
)}
{currentStep === 6 && (
  <>
<h3 className="mt-4">Design and Branding</h3>

<div className="design-section">
  <p className="section-helper">
    Capture the client’s branding readiness and design preferences.
  </p>

  <div className="design-question">
    <label className="design-label">Do you have a logo?</label>

    <select
      name="hasLogo"
      className="form-control"
      value={formData.hasLogo}
      onChange={handleChange}
      required
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Not sure">Not sure</option>
    </select>
    {errors.hasLogo && (
  <small className="text-danger">{errors.hasLogo}</small>
)}
  </div>

  <div className="design-question">
    <label className="design-label">Do you have existing brand colours ?</label>

    <select
      name="hasBrandColours"
      className="form-control"
      value={formData.hasBrandColours}
      onChange={handleChange}
      required
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Not sure">Not sure</option>
    </select>
{errors.hasBrandColours && (
  <small className="text-danger">{errors.hasBrandColours}</small>
)}

  </div>

  <div className="design-question">
    <label className="design-label">Do you have existing website content?</label>

    <select
      name="hasContent"
      className="form-control"
      value={formData.hasContent}
      onChange={handleChange}
      required
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Some content">Some content</option>
      <option value="Not sure">Not sure</option>
    </select>
    {errors.hasContent && (
  <small className="text-danger">{errors.hasContent}</small>
)}
  </div>

  <div className="design-question">
    <label className="design-label">Do you have images for your website?</label>

    <select
      name="hasImages"
      className="form-control"
      value={formData.hasImages}
      onChange={handleChange}
      required
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Some images">Some images</option>
      <option value="Not sure">Not sure</option>
    </select>
    {errors.hasImages && (
  <small className="text-danger">{errors.hasImages}</small>
)}
  </div>

  <div className="design-question">
    <label className="design-label">Example websites the client likes</label>

    <textarea
      name="exampleWebsites"
      className="form-control"
      value={formData.exampleWebsites}
      onChange={handleChange}
      placeholder="Paste website links or describe websites the client likes"
      rows="3"
    />
  </div>

  <div className="design-question">
    <label className="design-label">Notes about preferred design style</label>

    <textarea
      name="designNotes"
      className="form-control"
      value={formData.designNotes}
      onChange={handleChange}
      placeholder="Example: modern, clean, luxury, colourful, corporate, minimal"
      rows="4"
    />
  </div>
</div>
  </>
)}
{currentStep === 7 && (
  <>
          <h3 className="mt-4">Budget and Timeline</h3>

<div className="budget-section">
  <div className="budget-question">
    <label className="budget-label">Estimated Budget Range</label>
    <input
      type="text"
      name="budget"
      className="form-control"
      value={formData.budget}
      onChange={handleChange}
      placeholder="Example: R5,000 - R10,000"
      required
    />
    {errors.budget && (
  <small className="text-danger">{errors.budget}</small>
)}
  </div>

  <div className="budget-question">
    <label className="budget-label">Desired Launch Date</label>
    <input
      type="date"
      name="launchDate"
      className="form-control"
      value={formData.launchDate}
      onChange={handleChange}
      required
    />
    {errors.launchDate && (
  <small className="text-danger">{errors.launchDate}</small>
)}
  </div>

  <div className="budget-question">
    <label className="budget-label">Is the deadline flexible?</label>
    <select
      name="flexibleDeadline"
      className="form-control"
      value={formData.flexibleDeadline}
      onChange={handleChange}
      required
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Somewhat flexible">Somewhat flexible</option>
      <option value="Not sure">Not sure</option>
    </select>
    {errors.flexibleDeadline && (
  <small className="text-danger">{errors.flexibleDeadline}</small>
)}
  </div>

  <div className="budget-question">
    <label className="budget-label">
      Any important business dates or campaign dates?
    </label>

    <textarea
      name="importantDates"
      className="form-control"
      value={formData.importantDates}
      onChange={handleChange}
      placeholder="Example: Product launch, event date, marketing campaign, Black Friday sale"
      rows="4"
    />
  </div>
</div>
  </>
)}
<div className="d-flex gap-2 mt-4">
  {currentStep > 1 && (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={previousStep}
    >
      Previous
    </button>
  )}

  {currentStep < totalSteps ? (
    <button
      type="button"
      className="btn btn-primary"
      onClick={nextStep}
    >
      Next
    </button>
  ) : (
    <button type="submit" className="btn btn-success">
      Review Brief
    </button>
  )}
</div>

        </form>
      </div>
    </div>
  )
}

export default App