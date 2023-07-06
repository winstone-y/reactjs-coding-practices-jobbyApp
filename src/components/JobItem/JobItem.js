import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {TiLocation} from 'react-icons/ti'
import {Link} from 'react-router-dom'

const JobItem = props => {
  const {eachJob} = props

  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <li className="job-details">
      <Link className="jobitem-link" to={`/jobs/${id}`}>
        <div className="heading-section">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
          <h1 className="company-title">Description</h1>
          <p className="job-desc">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobItem
