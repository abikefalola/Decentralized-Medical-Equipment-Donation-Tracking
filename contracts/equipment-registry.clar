;; Equipment Registration Contract
;; Records details of donated medical devices

(define-data-var last-equipment-id uint u0)

(define-map equipment-registry
  { equipment-id: uint }
  {
    name: (string-ascii 100),
    description: (string-ascii 500),
    condition: (string-ascii 50),
    manufacturer: (string-ascii 100),
    manufacturing-date: uint,
    donor-id: principal,
    recipient-id: (optional principal),
    status: (string-ascii 20),
    registration-date: uint,
    last-updated: uint
  }
)

(define-public (register-equipment
                (name (string-ascii 100))
                (description (string-ascii 500))
                (condition (string-ascii 50))
                (manufacturer (string-ascii 100))
                (manufacturing-date uint))
  (let ((new-id (+ (var-get last-equipment-id) u1))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (var-set last-equipment-id new-id)
    (map-set equipment-registry
      { equipment-id: new-id }
      {
        name: name,
        description: description,
        condition: condition,
        manufacturer: manufacturer,
        manufacturing-date: manufacturing-date,
        donor-id: tx-sender,
        recipient-id: none,
        status: "registered",
        registration-date: current-time,
        last-updated: current-time
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-equipment (equipment-id uint))
  (ok (map-get? equipment-registry { equipment-id: equipment-id }))
)

(define-read-only (get-equipment-count)
  (ok (var-get last-equipment-id))
)

(define-public (update-equipment-status
                (equipment-id uint)
                (new-status (string-ascii 20)))
  (let ((equipment (unwrap! (map-get? equipment-registry { equipment-id: equipment-id }) (err u404)))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (asserts! (is-eq tx-sender (get donor-id equipment)) (err u403))
    (map-set equipment-registry
      { equipment-id: equipment-id }
      (merge equipment {
        status: new-status,
        last-updated: current-time
      })
    )
    (ok true)
  )
)

(define-public (assign-recipient
                (equipment-id uint)
                (recipient principal))
  (let ((equipment (unwrap! (map-get? equipment-registry { equipment-id: equipment-id }) (err u404)))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (asserts! (is-eq tx-sender (get donor-id equipment)) (err u403))
    (asserts! (is-eq (get status equipment) "verified") (err u400))
    (map-set equipment-registry
      { equipment-id: equipment-id }
      (merge equipment {
        recipient-id: (some recipient),
        status: "assigned",
        last-updated: current-time
      })
    )
    (ok true)
  )
)
