async function main() {

    /***********************************************************************
     ****************** DEPLOY ZuriSchoolVoting CONTRACT *******************
     ***********************************************************************/
    
    const MainContract = await ethers.getContractFactory("ZuriSchoolVoting");
    const mainContract = await MainContract.deploy("ZuriSchool", process.env.CHAIR_PERSON_WALLET_ADDRESS);

    console.log(`Contract address => ${mainContract.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1)
    });