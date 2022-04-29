import React from "react";

export default function StaffOffcanvas() {
  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBackdrop"
        aria-controls="offcanvasWithBackdrop"
      >
        All Staff
      </button>
      <div
        class="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasWithBackdrop"
        aria-labelledby="offcanvasWithBackdropLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasWithBackdropLabel">
            All Teachers and Directors
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <p>.....</p>
        </div>
      </div>
    </>
  );
}
