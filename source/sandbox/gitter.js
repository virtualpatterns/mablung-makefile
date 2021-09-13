import Git from 'nodegit'

async function main() {

  try {

    let repository = await Git.Repository.open('.')
    await Git.Status.foreach(repository, (path) => {
      console.log(path)
    })

  } catch (error) {
    console.error(error)
  }

}

main()
