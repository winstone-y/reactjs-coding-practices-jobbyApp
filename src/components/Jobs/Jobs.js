import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header/Header'
import JobItem from '../JobItem/JobItem'

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

const itemStatus = {
  success: 'SUCCESS',
  failed: 'FAIL',
  inProgress: 'IN_PROGRESS',
  notFound: 'NOT_FOUND',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    jobs: '',
    profileFail: itemStatus.inProgress,
    jobsFail: itemStatus.inProgress,
    employmentFilter: '',
    salaryOption: '',
    searchInput: '',
    jobsFilteredApi: '',
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const {history} = this.props
    const token = Cookies.get('jwt_token')
    // console.log(token)

    if (token === undefined) {
      history.replace('/')
    } else {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      }
      this.getProfileDetails(options)
      this.getJobsDetails(options)
    }
  }

  getProfileDetails = async options => {
    const profileApi = 'https://apis.ccbp.in/profile'
    const profileResponse = await fetch(profileApi, options)
    const profileData = await profileResponse.json()
    if (profileData !== undefined) {
      const formattedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      //   console.log(formattedProfileData)
      this.setState({
        profileDetails: formattedProfileData,
        profileFail: itemStatus.success,
      })
    } else {
      this.setState({profileFail: itemStatus.failed})
    }
  }

  getJobsDetails = async options => {
    const {
      jobsFilteredApi,
      employmentFilter,
      searchInput,
      salaryOption,
    } = this.state

    const jobsApi =
      jobsFilteredApi === ''
        ? `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${salaryOption}&search=${searchInput}`
        : jobsFilteredApi

    const jobsResponse = await fetch(jobsApi, options)
    const jobsData = await jobsResponse.json()

    if (jobsData.total !== 0) {
      const formattedJobsData = jobsData.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      //   console.log(formattedJobsData)
      this.setState({jobs: formattedJobsData, jobsFail: itemStatus.success})
    } else {
      this.setState({jobsFail: itemStatus.notFound})
      console.log('job list fail')
    }
  }

  renderProfileFail = () => (
    <div className="profile-fail">
      <button
        onClick={this.getProfileDetails}
        type="button"
        className="login-button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile">
        <img alt="profile" src={profileImageUrl} className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-desc">{shortBio}</p>
      </div>
    )
  }

  renderJobsFailure = () => (
    <div className="failure-view body">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        onClick={this.getJobsDetails}
        type="button"
        className="login-button "
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobs} = this.state
    // console.log(jobs, 'joblist')

    return (
      <ul className="jobs-list">
        {jobs.map(eachJob => (
          <JobItem eachJob={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderEmploymentList = () => {
    const onCheckBtn = event => {
      const {employmentFilter, searchInput, salaryOption} = this.state
      const filterItem = event.target.value
      let newFilter
      let newFilterString
      let newApi
      if (employmentFilter.includes(filterItem)) {
        newFilter = employmentFilter.filter(
          eachFilter => eachFilter !== filterItem,
        )
        newFilterString = newFilter.join(',')
        newApi = `https://apis.ccbp.in/jobs?employment_type=${newFilterString}&minimum_package=${salaryOption}&search=${searchInput}`
        this.setState(
          {
            employmentFilter: newFilter,
            jobsFilteredApi: newApi,
          },
          this.getDetails,
        )
      } else {
        newFilter = `${filterItem}`

        newApi = `https://apis.ccbp.in/jobs?employment_type=${newFilter}&minimum_package=${salaryOption}&search=${searchInput}`
        this.setState(
          prevState => ({
            employmentFilter: [...prevState.employmentFilter, filterItem],
            jobsFilteredApi: newApi,
          }),
          this.getDetails,
        )
      }
    }

    return (
      <ul className="employment-list">
        {employmentTypesList.map(eachType => {
          const {employmentTypeId, label} = eachType
          return (
            <li key={employmentTypeId}>
              <input
                id={employmentTypeId}
                type="checkbox"
                value={employmentTypeId}
                onClick={onCheckBtn}
              />
              <label className="label" htmlFor={employmentTypeId}>
                {label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  renderSalaryList = () => {
    const {salaryOption, searchInput, employmentFilter} = this.state

    const onSelectSalary = event => {
      const selectedSalaryOption = event.target.value
      const newApi = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${selectedSalaryOption}&search=${searchInput}`
      this.setState(
        {salaryOption: selectedSalaryOption, jobsFilteredApi: newApi},
        this.getDetails,
      )
    }

    return (
      <ul className="employment-list">
        {salaryRangesList.map(eachRange => {
          const {salaryRangeId, label} = eachRange
          const isChecked = salaryRangeId === salaryOption

          return (
            <li key={salaryRangeId}>
              <input
                onChange={onSelectSalary}
                id={salaryRangeId}
                type="radio"
                value={salaryRangeId}
                checked={isChecked}
              />
              <label className="label" htmlFor={eachRange.salaryRangeId}>
                {label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  renderSearchContainer = () => {
    const {employmentFilter, searchInput} = this.state
    const onChangeSearchInput = event => {
      const searchText = event.target.value.toLowerCase()
      this.setState({
        searchInput: searchText,
      })
    }

    const onClickSearch = () => {
      const newApi = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=1000000&search=${searchInput}`

      this.setState({jobsFilteredApi: newApi}, this.getDetails)
    }
    return (
      <div className="search-container">
        <input
          onChange={onChangeSearchInput}
          className="search-input search-button"
          type="search"
          placeholder="Search"
          value={searchInput}
        />
        <button
          onClick={onClickSearch}
          type="button"
          data-testid="searchButton"
          className="search-button"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobsDisplay = () => {
    const {jobsFail} = this.state
    switch (jobsFail) {
      case itemStatus.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case itemStatus.failed:
        return this.renderJobsFailure()

      case itemStatus.success:
        return this.renderJobsSuccess()
      case itemStatus.notFound:
        return (
          <div className="job-details">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )

      default:
        return null
    }
  }

  renderProfileDisplay = () => {
    const {profileFail} = this.state
    switch (profileFail) {
      case itemStatus.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case itemStatus.failed:
        return this.renderProfileFail()

      case itemStatus.success:
        return this.renderProfileSuccess()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg">
          <div className="side-nav">
            {this.renderProfileDisplay()}
            <div className="employment borders">
              <h1 className="employment-title">Type of Employment</h1>
              {this.renderEmploymentList()}
            </div>
            <div className="salary">
              <h1 className="employment-title">Salary Range</h1>
              {this.renderSalaryList()}
            </div>
          </div>
          <div className="jobs-list-body">
            {this.renderSearchContainer()}
            <div className="job-list">{this.renderJobsDisplay()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
