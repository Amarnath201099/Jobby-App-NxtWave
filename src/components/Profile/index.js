import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const loactionsList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {profileDetailsData: '', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updateFormatData = {profileDetails: data.profile_details}
      const {profileDetails} = updateFormatData
      const updateFormatProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileDetailsData: updateFormatProfileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateEmploymentType = event => {
    const {updateEmploymentType} = this.props
    updateEmploymentType(event.target.value)
  }

  updateSalaryRange = event => {
    const {updateSalaryRange} = this.props
    updateSalaryRange(event.target.value)
  }

  updateLocation = event => {
    const {updateLocation} = this.props
    updateLocation(event.target.value.toLowerCase())
  }

  getEmploymentTypesList = () =>
    employmentTypesList.map(eachType => (
      <li className="employment-each-type" key={eachType.employmentTypeId}>
        <input
          type="checkbox"
          id={eachType.employmentTypeId}
          value={eachType.employmentTypeId}
          onChange={this.updateEmploymentType}
        />
        <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
      </li>
    ))

  getSalaryRangeOptions = () =>
    salaryRangesList.map(eachRange => (
      <li className="employment-each-type" key={eachRange.salaryRangeId}>
        <input
          type="radio"
          id={eachRange.salaryRangeId}
          value={eachRange.salaryRangeId}
          onChange={this.updateSalaryRange}
          name="range"
        />
        <label htmlFor={eachRange.salaryRangeId}>{eachRange.label}</label>
      </li>
    ))

  getLocationList = () =>
    loactionsList.map(eachLocation => (
      <li className="employment-each-type" key={eachLocation.locationId}>
        <input
          type="checkbox"
          id={eachLocation.locationId}
          value={eachLocation.locationId}
          onChange={this.updateLocation}
        />
        <label htmlFor={eachLocation.locationId}>{eachLocation.label}</label>
      </li>
    ))

  getProfileSuccessView = () => {
    const {profileDetailsData} = this.state
    const {name, profileImageUrl, shortBio} = profileDetailsData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-short-bio">{shortBio}</p>
      </div>
    )
  }

  retryProfile = () => {
    this.getProfileData()
  }

  retryView = () => (
    <div className="retry-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.retryProfile}
      >
        Retry
      </button>
    </div>
  )

  getInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getProfileSuccessView()
      case apiStatusConstants.failure:
        return this.retryView()
      case apiStatusConstants.inProgress:
        return this.getInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        {this.getProfileView()}
        <hr className="underline" />
        <h1 className="sort-list-heading">Type of Employment</h1>
        <ul className="employment-types-container">
          {this.getEmploymentTypesList()}
        </ul>
        <hr className="underline" />
        <h1 className="sort-list-heading">Salary Range</h1>
        <ul className="salary-range-container">
          {this.getSalaryRangeOptions()}
        </ul>
        <hr className="underline" />
        <h1 className="sort-list-heading">Location</h1>
        <ul className="location-container">{this.getLocationList()}</ul>
      </>
    )
  }
}

export default Profile
