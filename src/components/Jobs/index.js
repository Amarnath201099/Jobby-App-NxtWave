import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Profile from '../Profile'
import AllJobs from '../AllJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    selectedSalaryRange: '',
    selectedEmploymentTypes: [],
    selectedLocations: [],
    searchInput: '',
    searchValue: '',
    allJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getallJobsData()
  }

  getallJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {
      selectedSalaryRange,
      selectedEmploymentTypes,
      selectedLocations,
      searchInput,
    } = this.state

    const selectedEmploymentTypesString = selectedEmploymentTypes.join(',')

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypesString}&minimum_package=${selectedSalaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updateFormatData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      if (updateFormatData.length === 0) {
        this.setState({apiStatus: apiStatusConstants.noJobs})
      } else {
        let jobsList = []
        if (selectedLocations.length > 0) {
          jobsList = updateFormatData.filter(eachJob =>
            selectedLocations.some(location =>
              eachJob.location.toLowerCase().includes(location.toLowerCase()),
            ),
          )
        }
        const jobsDataList = jobsList.length > 0 ? jobsList : updateFormatData
        this.setState({
          allJobsData: jobsDataList,
          apiStatus: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateEmploymentType = value => {
    const {selectedEmploymentTypes} = this.state
    if (selectedEmploymentTypes.length === 0) {
      this.setState(
        {
          selectedEmploymentTypes: [...selectedEmploymentTypes, value],
        },
        this.getallJobsData,
      )
    } else if (selectedEmploymentTypes.includes(value)) {
      const currentSelected = selectedEmploymentTypes.filter(
        eachType => eachType !== value,
      )
      this.setState(
        {selectedEmploymentTypes: [...currentSelected]},
        this.getallJobsData,
      )
    } else {
      this.setState(
        {
          selectedEmploymentTypes: [...selectedEmploymentTypes, value],
        },
        this.getallJobsData,
      )
    }
  }

  updateLocation = value => {
    const {selectedLocations} = this.state
    if (selectedLocations.length === 0) {
      this.setState(
        {
          selectedLocations: [...selectedLocations, value],
        },
        this.getallJobsData,
      )
    } else if (selectedLocations.includes(value)) {
      const currentSelected = selectedLocations.filter(
        eachType => eachType !== value,
      )
      this.setState(
        {selectedLocations: [...currentSelected]},
        this.getallJobsData,
      )
    } else {
      this.setState(
        {
          selectedLocations: [...selectedLocations, value],
        },
        this.getallJobsData,
      )
    }
  }

  updateSalaryRange = value => {
    this.setState({selectedSalaryRange: value}, this.getallJobsData)
  }

  updateSearchValue = event => {
    this.setState({searchValue: event.target.value})
  }

  givenSearchValue = () => {
    const {searchValue} = this.state
    this.setState({searchInput: searchValue}, this.getallJobsData)
  }

  updateSearchOnEnter = event => {
    if (event.key === 'Enter') {
      this.givenSearchValue()
    }
  }

  retryJobs = () => {
    this.getallJobsData()
  }

  getJobsSuccessView = () => {
    const {allJobsData} = this.state
    return <AllJobs allJobsData={allJobsData} />
  }

  getNoJobsView = () => (
    <div className="no-jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-failure-img"
      />
      <h1 className="no-jobs-failure-heading">No Jobs Found</h1>
      <p className="no-jobs-failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobsFailureView = () => (
    <div className="no-jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-failure-img"
      />
      <h1 className="no-jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button retry-failure-lg-btn"
        onClick={this.retryJobs}
      >
        Retry
      </button>
    </div>
  )

  getJobsInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getallJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getJobsSuccessView()
      case apiStatusConstants.noJobs:
        return this.getNoJobsView()
      case apiStatusConstants.failure:
        return this.getJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.getJobsInProgressView()
      default:
        return null
    }
  }

  render() {
    const {searchValue} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="search-sm-container">
            <input
              type="search"
              placeholder="Search"
              className="input-container"
              value={searchValue}
              onChange={this.updateSearchValue}
              onKeyDown={this.updateSearchOnEnter}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.givenSearchValue}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="jobs-profile-container">
            <Profile
              updateSalaryRange={this.updateSalaryRange}
              updateEmploymentType={this.updateEmploymentType}
              updateLocation={this.updateLocation}
            />
          </div>
          <div className="jobs-search-all-jobs-container">
            <div className="search-lg-container">
              <input
                type="search"
                placeholder="Search"
                className="input-container"
                value={searchValue}
                onChange={this.updateSearchValue}
                onKeyDown={this.updateSearchOnEnter}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.givenSearchValue}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getallJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
