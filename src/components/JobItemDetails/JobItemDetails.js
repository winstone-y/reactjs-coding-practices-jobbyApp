import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {TiLocation} from 'react-icons/ti'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header/Header'

const jobItemStatus = {
  success: 'SUCCESS',
  failed: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemFound: jobItemStatus.inProgress,
    jobDetails: '',
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match, history} = this.props
    const token = Cookies.get('jwt_token')
    // console.log(token)

    if (token === undefined) {
      history.replace('/')
    }
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const {params} = match
    const {id} = params
    const jobItemDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(jobItemDetailsUrl, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok) {
      const formattedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = formattedData
      const formattedJobDetails = {
        id: jobDetails.id,
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        skillsList: jobDetails.skills,
        companyWebsiteUrl: jobDetails.company_website_url,
        lifeAtCompany: jobDetails.life_at_company,
      }
      this.setState({
        jobItemFound: jobItemStatus.success,
        jobDetails: formattedJobDetails,
        similarJobsList: similarJobs,
      })
    } else {
      this.setState({jobItemFound: jobItemStatus.failed})
    }
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
        onClick={this.getJobItemDetails}
        type="button"
        className="login-button "
      >
        Retry
      </button>
    </div>
  )

  renderJobItemSuccess = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skillsList,
      companyWebsiteUrl,
      lifeAtCompany,
    } = jobDetails
    return (
      <>
        <div className="job-details">
          <div className="heading-section">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="heading-rating">
              <h1 className="company-title">{title}</h1>
              <div className="rating-card">
                <BsStarFill className="star icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="address-section">
            <div className="rating-card">
              <TiLocation className="icon" />
              <p className="job-desc">{location}</p>
            </div>
            <div className="rating-card">
              <BsBriefcaseFill className="icon" />
              <p className="job-desc">{employmentType}</p>
            </div>
            <div className="package">
              <p className="job-desc ">{packagePerAnnum}</p>
            </div>
          </div>
          <div className="desc-section">
            <div className="desc-header">
              <h1 className="company-title">Description</h1>
              <a href={companyWebsiteUrl} className="site-link">
                Visit <FiExternalLink />
              </a>
            </div>
            <p className="job-desc">{jobDescription}</p>
          </div>
          <div className="skills-section">
            <h1 className="company-title">Skills</h1>
            <ul className="skill-list">
              {skillsList.map(eachSkill => (
                <li key={eachSkill.name} className="skill-item">
                  <img
                    alt={eachSkill.name}
                    src={eachSkill.image_url}
                    className="skill-image"
                  />
                  <p className="skill-desc">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-section">
              <h1 className="company-title">Life at Company</h1>
              <div className="life-at-company-body">
                <p className="job-desc">{lifeAtCompany.description}</p>
                <img
                  className="life-at-company-image"
                  alt="life at company"
                  src={lifeAtCompany.image_url}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="similar-jobs">{this.renderSimilarJobs()}</div>
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <>
        <h1 className="failure-title">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsList.map(eachJob => {
            const formattedEachJob = {
              id: eachJob.id,
              companyLogoUrl: eachJob.company_logo_url,
              employmentType: eachJob.employment_type,
              jobDescription: eachJob.job_description,
              location: eachJob.location,

              rating: eachJob.rating,
              title: eachJob.title,
            }
            const {
              id,
              companyLogoUrl,
              employmentType,
              jobDescription,
              location,
              rating,
              title,
            } = formattedEachJob

            return (
              <li key={id} className="job-details similar-job-item">
                <div className="heading-section">
                  <img
                    src={companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="heading-rating">
                    <h1 className="company-title similar">{title}</h1>
                    <div className="rating-card">
                      <BsStarFill className="star icon" />
                      <p className="rating">{rating}</p>
                    </div>
                  </div>
                </div>
                <div className="desc-section">
                  <div className="desc-header">
                    <h1 className="company-title similar">Description</h1>
                  </div>
                  <p className="job-desc">{jobDescription}</p>
                </div>
                <div className="address-section similar">
                  <div className="rating-card">
                    <TiLocation className="icon" />
                    <p className="job-desc">{location}</p>
                  </div>
                  <div className="rating-card">
                    <BsBriefcaseFill className="icon" />
                    <p className="job-desc">{employmentType}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  renderDisplay = () => {
    const {jobItemFound} = this.state
    switch (jobItemFound) {
      case jobItemStatus.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case jobItemStatus.failed:
        return this.renderJobsFailure()

      case jobItemStatus.success:
        return this.renderJobItemSuccess()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-body">
          <div>{this.renderDisplay()}</div>
        </div>
      </>
    )
  }
}

export default JobItemDetails
