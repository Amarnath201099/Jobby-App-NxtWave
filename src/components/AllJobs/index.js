import {Component} from 'react'
import {Link} from 'react-router-dom'

import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

class AllJobs extends Component {
  getEachJobDetails = eachJob => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      id,
    } = eachJob

    return (
      <Link to={`/jobs/${id}`} className="link-style" key={id}>
        <li className="all-jobs-each-job-container">
          <div className="all-jobs-logo-title-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="all-jobs-company-logo"
            />
            <div>
              <h1 className="all-jobs-title">{title}</h1>
              <div className="all-jobs-rating-container">
                <BsFillStarFill className="all-jobs-star" />
                <p className="all-jobs-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="all-jobs-loc-emp-pack-container">
            <div className="all-jobs-loc-emp-container">
              <div className="all-jobs-loc-emp-each">
                <MdLocationOn className="all-jobs-icon" />
                <p className="all-jobs-location">{location}</p>
              </div>
              <div className="all-jobs-loc-emp-each">
                <BsBriefcaseFill className="all-jobs-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="underline" />
          <h1 className="all-jobs-description-title">Description</h1>
          <p className="all-jobs-description">{jobDescription}</p>
        </li>
      </Link>
    )
  }

  render() {
    const {allJobsData} = this.props

    return (
      <ul className="all-jobs-list-container">
        {allJobsData.map(eachJob => this.getEachJobDetails(eachJob))}
      </ul>
    )
  }
}

export default AllJobs
