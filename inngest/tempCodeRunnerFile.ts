const { output: fragmentTitleOutput } = await fragementTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOuput } = await responseGenerator.run(
      result.state.data.summary
    );