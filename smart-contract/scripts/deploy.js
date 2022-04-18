async function main() {

    /***********************************************************************
     ************************* DEPLOY <CONTRACT> ***************************
     ***********************************************************************/

    const MainContract = await ethers.getContractFactory("<CONTRACT-NAME>");
    const mainContract = await MainContract.deploy();

    console.log(`Contract address => ${mainContract.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1)
    });