<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Complex Raster</se:Name>
    <UserStyle>
      <se:Name>Complex Raster</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Small populated New Yorks</se:Name>
          <se:RasterSymbolizer uom="http://www.opengeospatial.org/se/units/pixel">
            <se:Opacity>0.5</se:Opacity>
            <se:ColorMap type="ramp">
              <se:ColorMapEntry color="#323232" quantity="-300" label="label1" opacity="1"/>
              <se:ColorMapEntry color="#BBBBBB" quantity="200" label="label2" opacity="1"/>
            </se:ColorMap>
            <se:ChannelSelection>
              <se:RedChannel>
                <se:SourceChannelName>1</se:SourceChannelName>
              </se:RedChannel>
              <se:BlueChannel>
                <se:SourceChannelName>2</se:SourceChannelName>
                <se:ContrastEnhancement>
                  <se:Histogram/>
                  <se:GammaValue>2</se:GammaValue>
                </se:ContrastEnhancement>
              </se:BlueChannel>
              <se:GreenChannel>
                <se:SourceChannelName>3</se:SourceChannelName>
                <se:ContrastEnhancement>
                  <se:Normalize/>
                </se:ContrastEnhancement>
              </se:GreenChannel>
            </se:ChannelSelection>
            <se:ContrastEnhancement>
              <se:Histogram/>
            </se:ContrastEnhancement>
          </se:RasterSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
