import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'
import SimilarJobsCard from '../SimilarJobsCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsData: '',
    jobSkills: [],
    jobLifeAtCompany: '',
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updateFormatData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const {jobDetails, similarJobs} = updateFormatData

      const updateFormatJobDetailsData = {
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        companyWebsiteUrl: jobDetails.company_website_url,
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
      }

      this.setState({
        jobDetailsData: updateFormatJobDetailsData,
        jobSkills: updateFormatJobDetailsData.skills,
        jobLifeAtCompany: {
          description: updateFormatJobDetailsData.lifeAtCompany.description,
          imageUrl: updateFormatJobDetailsData.lifeAtCompany.image_url,
        },
        similarJobsData: similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getEachSkill = eachSkill => {
    const updatedFormatEachSkill = {
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }
    const {imageUrl, name} = updatedFormatEachSkill

    return (
      <li key={name} className="job-details-each-skill-container">
        <img src={imageUrl} alt={name} className="job-details-skill-img" />
        <p>{name}</p>
      </li>
    )
  }

  getLifeAtCompany = jobLifeAtCompany => {
    const {description, imageUrl} = jobLifeAtCompany

    return (
      <>
        <div className="job-details-life-at-company-des-con">
          <h1 className="job-details-sub-titles">Life at Company</h1>
          <p className="job-details-description">{description}</p>
        </div>
        <img
          src={imageUrl}
          alt="life at company"
          className="job-details-life-at-com-img"
        />
      </>
    )
  }

  retryJobDetails = () => {
    this.getJobDetailsData()
  }

  getInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getSuccessView = () => {
    const {jobDetailsData, jobSkills, jobLifeAtCompany, similarJobsData} =
      this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsData

    return (
      <>
        <div className="job-details-container">
          <div className="job-details-logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div>
              <h1 className="job-details-title">{title}</h1>
              <div className="job-details-rating-container">
                <BsFillStarFill className="job-details-star" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-loc-emp-pack-container">
            <div className="job-details-loc-emp-container">
              <div className="job-details-loc-emp-each">
                <MdLocationOn className="job-details-icon" />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-loc-emp-each">
                <BsBriefcaseFill className="job-details-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="underline" />
          <div className="job-details-description-company-link-container">
            <h1 className="job-details-sub-titles">Description</h1>
            <a href={companyWebsiteUrl} className="job-details-company-link">
              Visit
              <FaExternalLinkAlt className="job-details-link-icon" />
            </a>
          </div>
          <p className="job-details-description">{jobDescription}</p>
          <div>
            <h1 className="job-details-sub-titles">Skills</h1>
            <ul className="job-details-skills-list-container">
              {jobSkills.map(eachSkill => this.getEachSkill(eachSkill))}
            </ul>
          </div>
          <div className="job-details-life-at-company-container">
            {this.getLifeAtCompany(jobLifeAtCompany)}
          </div>
        </div>
        <h1 className="job-details-similar-jobs-title">Similar Jobs</h1>
        <ul className="similar-job-list-container">
          {similarJobsData.map(eachJob => (
            <SimilarJobsCard key={eachJob.id} eachJobDetails={eachJob} />
          ))}
        </ul>
      </>
    )
  }

  getFailureView = () => (
    <div className="job-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="job-details-failure-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-details-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button retry-failure-lg-btn"
        onClick={this.retryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  getJobDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.getInProgressView()
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.failure:
        return this.getFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-bg-container">
          {this.getJobDetailsView()}{' '}
        </div>
      </>
    )
  }
}

export default JobItemDetails
