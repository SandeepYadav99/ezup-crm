import React from "react";
import styles from "./styles.module.css";
import { Add, Delete, VerifiedUser } from '@mui/icons-material';
import Review from "../../../../assets/img/sent_blue.svg";
import ic_add from "../../../../assets/img/ic_add.png";
import { ButtonBase } from '@mui/material';
import ConfirmationPopup from "./components/ConfirmationPopup";
import useBadgesHook from "./BadgesHook";
import AssignBadge from "./components/AssignBadge/AssignBadge";
const Badges = ({ userProfile }) => {
  const {
    toggleIsOpenDialog,
    isOpenDialog,
    types,
    badges,
    isOpen,
    toggleIsOpen,
    setBadgeId,
    badgeId,
    badgeIds,
  } = useBadgesHook();
  console.log(badgeId, "Badge Id");
  return (
    <div>
      <div className={styles.plainPaper}>
        <div className={styles.newContainer}>
          <div className={styles.headerTitle}>
            <span>
              <b>Badge Details</b>
            </span>

            <ButtonBase className={styles.addTask} onClick={toggleIsOpen}>
              <Add /> ASSIGN BADGE
            </ButtonBase>
          </div>
          <div className={styles.gaps} />

          <div className={styles.kycContainer}>
            {badges?.map((badge, index) => (
              <React.Fragment key={index}>
                {badge.badges?.map((badsub, index) => (
                  <div className={styles.card_badges} key={index}>
                    <div className={styles.sub_card_badges}>
                      <img src={badsub?.logo} alt="..." />
                      <ButtonBase
                        className={styles.action_button}
                        onClick={() => {
                          toggleIsOpenDialog(badsub?.id, badge?.id);
                        }}
                      >
                        <Delete fontSize="small" />
                        Delete
                      </ButtonBase>
                    </div>
                    <div className={styles.paragraph}>
                      <b>{badsub?.name}</b>
                      <br />
                      {badge?.admins?.name} | {badge?.createdAtText}
                    </div>
                   
                  </div>
                ))}
               <div className={styles.gaps} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationPopup
        badgeId={badgeId}
        badgeIds={badgeIds}
        isOpen={isOpenDialog}
        handleToggle={toggleIsOpenDialog}
        status={userProfile?.status}
        types={types}
      />

      <AssignBadge
        candidateId={badges?._id}
        isOpen={isOpen}
        handleToggle={toggleIsOpen}
        status={userProfile?.status}
      />
    </div>
  );
};

export default Badges;
