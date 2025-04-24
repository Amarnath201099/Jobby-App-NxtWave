import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobsCard = props => {
  const {eachJobDetails} = props

  const updateFormatJobDetailsata = {
    companyLogoUrl: eachJobDetails.company_logo_url,
    employmentType: eachJobDetails.employment_type,
    id: eachJobDetails.id,
    jobDescription: eachJobDetails.job_description,
    location: eachJobDetails.location,
    rating: eachJobDetails.rating,
    title: eachJobDetails.title,
  }

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = updateFormatJobDetailsata

  return (
    <li className="similar-job-container">
      <div className="similar-job-logo-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-company-logo"
        />
        <div>
          <h1 className="similar-job-title">{title}</h1>
          <div className="similar-job-rating-container">
            <BsFillStarFill className="similar-job-star" />
            <p className="similar-job-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-description-title">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
      <div className="similar-job-loc-emp-container">
        <div className="similar-job-loc-emp-each">
          <MdLocationOn className="similar-job-icon" />
          <p className="similar-job-location">{location}</p>
        </div>
        <div className="similar-job-loc-emp-each">
          <BsBriefcaseFill className="similar-job-icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobsCard
