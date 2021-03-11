<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Complex Raster</Name>
    <UserStyle>
      <Title>Complex Raster</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Small populated New Yorks</Name>
          <RasterSymbolizer>
            <Opacity>0.5</Opacity>
            <ChannelSelection>
              <RedChannel>
                <SourceChannelName>1</SourceChannelName>
              </RedChannel>
              <GreenChannel>
                <SourceChannelName>3</SourceChannelName>
                <ContrastEnhancement>
                  <Normalize/>
                </ContrastEnhancement>
              </GreenChannel>
              <BlueChannel>
                <SourceChannelName>2</SourceChannelName>
                <ContrastEnhancement>
                  <Histogram/>
                  <GammaValue>2</GammaValue>
                </ContrastEnhancement>
              </BlueChannel>
            </ChannelSelection>
            <ColorMap type="ramp">
              <ColorMapEntry color="#323232" quantity="-300" label="label1" opacity="1"/>
              <ColorMapEntry color="#BBBBBB" quantity="200" label="label2" opacity="1"/> 
            </ColorMap>
            <ContrastEnhancement>
              <Histogram/>
            </ContrastEnhancement>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
