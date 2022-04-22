import { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import NoticeBoard from "./NoticeBoard";

export default function Profile() {

  const { profileDetails } = useContext(electionContext)

  return (
    <div className="container-lg bg-light justify-content-center">
      <div className="row  g-3">
        <div className="col-md-9">
          {profileDetails && (
            <div class="card shadow-sm m-4 border-0">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png
"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body text-center">
                    <h5 class="card-title">{profileDetails.name}</h5>
                    <p class="card-text">I am a {profileDetails.userType}</p>
                    <p class="card-text">
                      <small class="lead">
                        Allowed to vote {profileDetails.canVote ? "Yes" : "No"}
                      </small>
                    </p>
                    <p class="card-text">
                      <small class="text-muted">Last updated 3 mins ago</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-3">
          <NoticeBoard />
        </div>
      </div>
    </div>
  )
}
